import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const { action, userId, targetUserId } = await request.json()

    // 사용자 정보 가져오기
    const userQuery = query(collection(db, 'User'), where('userId', '==', userId))
    const userSnapshot = await getDocs(userQuery)

    const targetUserQuery = query(collection(db, 'User'), where('userId', '==', targetUserId))
    const targetUserSnapshot = await getDocs(targetUserQuery)

    if (userSnapshot.empty || targetUserSnapshot.empty) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userSnapshot.docs[0].data()
    const targetUserData = targetUserSnapshot.docs[0].data()

    switch (action) {
      case 'follow':
        // 내 following 목록 업데이트
        await updateDoc(doc(db, 'User', userData.docId), {
          following: arrayUnion(targetUserData.uid)
        })

        // 상대방 followers 목록 업데이트
        await updateDoc(doc(db, 'User', targetUserData.docId), {
          followers: arrayUnion(userData.uid)
        })

        return NextResponse.json({ success: true })

      case 'unfollow':
        // 내 following 목록 업데이트
        await updateDoc(doc(db, 'User', userData.docId), {
          following: arrayRemove(targetUserData.uid)
        })

        // 상대방 followers 목록 업데이트
        await updateDoc(doc(db, 'User', targetUserData.docId), {
          followers: arrayRemove(userData.uid)
        })

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Follow action error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

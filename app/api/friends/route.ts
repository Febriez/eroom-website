import { NextRequest, NextResponse } from 'next/server'
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../../lib/firebase'

export async function POST(request: NextRequest) {
  try {
    const { action, userId, targetUserId, requestId } = await request.json()

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
      case 'send':
        // 친구 요청 추가
        const requestRef = await addDoc(collection(db, 'friendRequests'), {
          from: userData.uid,
          fromNickname: userData.nickname,
          fromUserId: userData.userId,
          to: targetUserData.uid,
          toNickname: targetUserData.nickname,
          toUserId: targetUserData.userId,
          status: 'pending',
          createdAt: new Date()
        })

        // 알림 추가
        await addDoc(collection(db, 'notifications'), {
          to: targetUserData.uid,
          from: userData.uid,
          fromNickname: userData.nickname,
          fromUserId: userData.userId,
          type: 'friend_request',
          title: '친구 요청',
          message: `${userData.nickname}님이 친구 요청을 보냈습니다.`,
          createdAt: new Date(),
          read: false,
          requestId: requestRef.id
        })

        return NextResponse.json({ success: true, requestId: requestRef.id })

      case 'accept':
        if (!requestId) {
          return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
        }

        // 내 친구 목록에 추가
        await updateDoc(doc(db, 'User', userData.docId), {
          friends: arrayUnion(targetUserData.uid),
          friendsCount: (userData.friends?.length || 0) + 1
        })

        // 상대방 친구 목록에도 추가
        await updateDoc(doc(db, 'User', targetUserData.docId), {
          friends: arrayUnion(userData.uid),
          friendsCount: (targetUserData.friends?.length || 0) + 1
        })

        // 친구 요청 문서 삭제
        await deleteDoc(doc(db, 'friendRequests', requestId))

        // 수락 알림 보내기
        await addDoc(collection(db, 'notifications'), {
          to: targetUserData.uid,
          from: userData.uid,
          fromNickname: userData.nickname,
          type: 'friend_request',
          title: '친구 요청 수락됨',
          message: `${userData.nickname}님이 친구 요청을 수락했습니다.`,
          createdAt: new Date(),
          read: false
        })

        return NextResponse.json({ success: true })

      case 'reject':
        if (!requestId) {
          return NextResponse.json({ error: 'Request ID is required' }, { status: 400 })
        }

        // 친구 요청 문서 삭제
        await deleteDoc(doc(db, 'friendRequests', requestId))

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Friend request error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import {
    collection,
    doc,
    getDoc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    QueryConstraint,
    startAfter,
    Unsubscribe
} from 'firebase/firestore'
import {db} from '../config'
import type {PaginationParams} from '@/lib/firebase/types'

export abstract class BaseService {
    protected static async getDocument<T>(
        collectionName: string,
        docId: string
    ): Promise<T | null> {
        try {
            const docRef = doc(db, collectionName, docId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                return {id: docSnap.id, ...docSnap.data()} as T
            }
            return null
        } catch (error) {
            console.error(`Error getting document from ${collectionName}:`, error)
            throw error
        }
    }

    protected static async queryDocuments<T>(
        collectionName: string,
        constraints: QueryConstraint[],
        pagination?: PaginationParams
    ): Promise<T[]> {
        try {
            const constraints_with_pagination = [...constraints]

            if (pagination) {
                if (pagination.orderBy) {
                    constraints_with_pagination.push(
                        orderBy(pagination.orderBy, pagination.direction || 'desc')
                    )
                }
                if (pagination.limit) {
                    constraints_with_pagination.push(limit(pagination.limit))
                }
                if (pagination.startAfter) {
                    constraints_with_pagination.push(startAfter(pagination.startAfter))
                }
            }

            const q = query(collection(db, collectionName), ...constraints_with_pagination)
            const querySnapshot = await getDocs(q)

            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as T))
        } catch (error) {
            console.error(`Error querying ${collectionName}:`, error)
            throw error
        }
    }

    protected static subscribeToDocument<T>(
        collectionName: string,
        docId: string,
        callback: (data: T | null) => void
    ): Unsubscribe {
        const docRef = doc(db, collectionName, docId)

        return onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                callback({id: doc.id, ...doc.data()} as T)
            } else {
                callback(null)
            }
        }, (error) => {
            console.error(`Error subscribing to ${collectionName}/${docId}:`, error)
            callback(null)
        })
    }

    protected static subscribeToQuery<T>(
        collectionName: string,
        constraints: QueryConstraint[],
        callback: (data: T[]) => void
    ): Unsubscribe {
        const q = query(collection(db, collectionName), ...constraints)

        return onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as T))
            callback(data)
        }, (error) => {
            console.error(`Error subscribing to ${collectionName} query:`, error)
            callback([])
        })
    }
}
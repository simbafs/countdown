export interface Agenda {
	sessions: Session[]
	speakers: Speaker[]
	session_types: CategoryInfo[]
	rooms: CategoryInfo[]
	tags: CategoryInfo[]
}

export interface Session {
	id: string
	type: string
	room: string
	broadcast: string[] | null
	start: string // ISO 8601 格式
	end: string // ISO 8601 格式
	qa: string | null
	slide: string | null
	co_write: string | null
	record: string | null
	live: string | null
	language: string | null
	uri: string | null
	zh: Content
	en: Content
	speakers: string[] // 講者 ID 列表
	tags: string[] // 標籤 ID 列表
}

export interface Speaker {
	id: string
	avatar: string
	zh: SpeakerDetail
	en: SpeakerDetail
}

export interface SpeakerDetail {
	name: string
	bio: string
}

export interface Content {
	title: string
	description: string
}

/**
 * 用於 session_types, rooms, 與 tags 的通用結構
 */
export interface CategoryInfo {
	id: string
	zh: DisplayDetail
	en: DisplayDetail
}

export interface DisplayDetail {
	name: string
	description: string
}

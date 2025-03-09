export interface Post {
  id: number,
  userId: number,
  albumId: number,
  upload_Date: Date,
  url_File: string,
  description: string,
  contentType: string,
  currentUserData: any
}
import mongoose from "mongoose"

export type User = {
  email: string
  passwordHash: string
}

const userSchema = new mongoose.Schema<User>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
)

export const UserModel =
  mongoose.models.User ?? mongoose.model<User>("User", userSchema)

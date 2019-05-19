import mongoose, { Schema } from 'mongoose'

const accountsSchema = new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  account_type: {
    type: String
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (obj, ret) => { delete ret._id }
  }
})

accountsSchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      email: this.email,
      password: this.password,
      type: this.type,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('Accounts', accountsSchema)

export const schema = model.schema
export default model

const
  { send }        =  require('../../utils'),
  Type            =  require('../../../Models/type.js'),
  Vedio           =  require('../../../Models/vedio.js'),
  BaseContructor  =  require('./base.js')

module.exports = class TypeClass extends BaseContructor {
  // Type
  static async putType(ctx) {
    const body = ctx.request.body

    const requiredKeys = [
      'name'
    ]

    for (let key of requiredKeys) {
      if (!(key in body))
        return ctx.body = {
          Error: '请求格式错误'
        }
    }

    const newType = new Type(body)

    try {
      const Id = await newType.save()
      ctx.status = 201
      return ctx.body = { Id }
    } catch(e) {
      return ctx.body = {
        Error: e.message
      }
    }
  }

  static async delType(ctx) {
    const body = ctx.request.body

    if (!body.ids)
      return ctx.body = {
        Error: '请求格式错误'
      }

    const ids = body.ids.split('+')

    try {
      await Promise.all([
        Type.remove({ _id: { $in: ids } }),
        Vedio.update({ type: { $in: ids } }, { $pull: { type: { $in: ids } } })
      ])

      return ctx.status = 204
    } catch(e) {
      return ctx.body = {
        Error: e.message
      }
    }
  }

  static async postType(ctx) {
    const body = ctx.request.body

    if (!body.id || !body.update)
      return ctx.body = {
        Error: '请求格式错误'
      }

    try {
      let doc = await Type.findById({ _id: body.id })

      Object.assign(doc, body.update)

      await doc.save()

      return ctx.status = 201
    } catch(e) {
      return ctx.body = {
        Error: e.message
      }
    }
  }

  static async getType(ctx) {
    const id = ctx.params.id
    const query = ctx.request.query

    if (!query.keys) {
      if (query.populate) {
        try {
          const data = await Type
            .findById(id)
            .populate({
              path: 'vedios',
              match: { isthrough: true }
            })

          return ctx.body = {
            Total: 1,
            ResultList: [ data ]
          }
        } catch(e) {
          return ctx.body = {
            Error: e.message
          }
        }
      } else {
        try {
          const data = await Type.findById(id)

          return ctx.body = {
            Total: 1,
            ResultList: [ data ]
          }
        } catch(e) {
          return ctx.body = {
            Error: e.message
          }
        }
      }
    } else {
      const keys = query.keys.split('+').join(' ')

      if (query.populate) {
        try {
          const data = await Type
            .find({ _id: id })
            .populate({
              path: 'vedios',
              match: { isthrough: true }
            })
            .select(keys)

          return ctx.body = {
            Total: 1,
            ResultList: data
          }
        } catch(e) {
          return ctx.body = {
            Error: e.message
          }
        }
      } else {
        try {
          const data = await Type
            .find({ _id: id })
            .select(keys)

          return ctx.body = {
            Total: 1,
            ResultList: data
          }
        } catch(e) {
          return ctx.body = {
            Error: e.message
          }
        }
      }
    }

  }

  static async getTypes(ctx) {
    const query = ctx.request.query

    if (query.ids) {
      const ids = query.ids.split('+')

      if (!query.keys) {
        if (query.populate) {
          try {
            let datas = await Type
              .find({ _id: { $in: ids } })
              .populate({
                path: 'vedios',
                match: { isthrough: true }
              })

            const count = await Type.count()

            return ctx.body = {
              Total: count,
              ResultList: datas
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        } else {
          try {
            let datas = await Type
              .find({ _id: { $in: ids } })

            const count = await Type.count()

            return ctx.body = {
              Total: count,
              ResultList: datas
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        }
      } else {
        const keys = query.keys.split('+').join(' ')

        if (query.populate) {
          try {
            let datas = await Type
              .find({ _id: { $in: ids } })
              .populate({
                path: 'vedios',
                match: { isthrough: true }
              })
              .select(keys)

            const count = await Type.count()

            return ctx.body = {
              Total: count,
              ResultList: datas
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        } else {
          try {
            let datas = await Type
              .find({ _id: { $in: ids } })
              .select(keys)

            const count = await Type.count()

            return ctx.body = {
              Total: count,
              ResultList: datas
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        }
      }
    } else if (!query.limit || !query.page) {
      return ctx.body = {
        Error: '请求格式错误'
      }
    } else {
      if (!query.keys) {
        if (query.populate) {
          try {
            let datas = await Type
              .find({})
              .populate({
                path: 'vedios',
                match: { isthrough: true }
              })
              .limit(query.limit - 0)
              .skip((query.page - 1) * query.limit)

            const count = await Type.count()

            return ctx.body = {
              Total: count,
              ResultList: datas
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        } else {
          try {
            let datas = await Type
              .find({})
              .limit(query.limit - 0)
              .skip((query.page - 1) * query.limit)

            const count = await Type.count()

            return ctx.body = {
              Total: count,
              ResultList: datas
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        }
      } else {
        const keys = query.keys.split('+').join(' ')

        if (query.populate) {
          try {
            let data = Type
              .find({})
              .select(keys)
              .populate({
                path: 'vedios',
                match: { isthrough: true }
              })
              .limit(query.limit - 0)
              .skip((query.page - 1) * query.limit)

            let count = Type.count()

            let datas = await Promise.all([data, count])

            return ctx.body = {
              Total: datas[1],
              ResultList: datas[0]
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        } else {
          try {
            let data = Type
              .find({})
              .select(keys)
              .limit(query.limit - 0)
              .skip((query.page - 1) * query.limit)

            let count = Type.count()

            let datas = await Promise.all([data, count])

            return ctx.body = {
              Total: datas[1],
              ResultList: datas[0]
            }
          } catch(e) {
            return ctx.body = {
              Error: e.message
            }
          }
        }
      }
    }
  }


}

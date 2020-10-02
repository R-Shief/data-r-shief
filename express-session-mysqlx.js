/*!
 * Based On
 * Connect - Redis
 */

module.exports = function (session) {
  const Store = session.Store

  const noop = () => {}

  class MysqlXStore extends Store {
    constructor(options = {}) {
      super(options)
      if (!options.client) {
        throw new Error('A client must be directly provided to the MysqlXStore')
      }

      this.client = options.client
      this.ttl = options.ttl || 86400 // One day in seconds.
      this.disableTouch = options.disableTouch || false
      this.schema = options.schema
      this.collection = options.collection
    }

    get(sid, cb = noop) {
      this.client.getSession().then(session => {
        var db = session.getSchema(this.schema);
        var coll = db.getCollection(this.collection);
        coll.find("sid = :sid").limit(1).bind("sid", sid).execute()
          .then(doc => {
            cb(null, doc.fetchOne());
            session.close();
          });
      }).catch(err => cb(err))
    }

    set(sid, sess, cb = noop) {
      Object.assign(sess, {sid: sid, expires: Date.now() + (this.ttl * 1000)});
      this.client.getSession().then(session => {
        var db = session.getSchema(this.schema);
        var coll = db.getCollection(this.collection);
        var doc = coll.find("sid = :sid").bind("sid", sid).execute();
        doc.then(d => {
          let dd = d.toArray();
          if (dd.length == 0) {
            coll.add(sess).execute();
          } else {
            coll.modify("sid = :sid").bind("sid", sid).patch(sess).execute();
          }
          session.close();
          return cb(null);
        })

      }).catch(err => cb(err))
    }

    touch(sid, sess, cb = noop) {
      if (this.disableTouch) return cb();

      this.client.getSession().then(session => {
        var db = session.getSchema(this.schema);
        var coll = db.getCollection(this.collection);
        coll.find("sid = :sid").bind("sid", sid).execute()
          .then(result => {
            let doc = result.fetchOne();
            // console.log(Number(new Date(sess.cookie.expires)) - Date.now());
            if (Number(new Date(sess.cookie.expires)) - Date.now() <= 0) this.destroy(sid)
            cb(null);
            session.close();
          })
      }).catch(err => cb(err))
    }

    destroy(sid, cb = noop) {
      this.client.getSession().then(session => {
        var db = session.getSchema(this.schema);
        var coll = db.getCollection(this.collection);

        // Delete everything related to this session id in sessionTweet while we're at it.
        let deleteSQL = `DELETE FROM sessionTweet WHERE session_id = ${sid}`;
        session.sql(deleteSQL).execute();

        coll.find("sid = :sid").bind("sid", sid).execute()
          .then(result => {
            let doc = result.fetchOne();
            coll.removeOne(doc._id);
            session.close();
          })
        return cb(null);
      }).catch(err => cb(err));
    }

    clear(cb = noop) {
      this.client.getSession().then(session => {
        var db = session.getSchema(this.schema);
        var coll = db.getCollection(this.collection);

        // Delete everything in sessionTweet while we're at it.
        let deleteSQL = `DELETE FROM sessionTweet`;
        session.sql(deleteSQL).execute();

        coll.remove("true").execute()
        .then(() => session.close());
        return cb(null);
      }).catch(err => cb(err));
    }

    length(cb = noop) {
      this.client.getSession().then(session => {
        var db = session.getSchema(this.schema);
        var coll = db.getCollection(this.collection);
        coll.find().execute().then(result => {
          let length = result.toArray().length;
          cb(null, length);
          session.close();
        });
      }).catch(err => cb(err));
    }

    all(cb = noop) {
      this.client.getSession().then(session => {
        var db = session.getSchema(this.schema);
        var coll = db.getCollection(this.collection);
        coll.find().execute().then(result => {
          cb(null, result.toArray());
        })
      }).catch(err => cb(err));
    }

    // _getTTL(sess) {
    //   let ttl
    //   if (sess && sess.cookie && sess.cookie.expires) {
    //     let ms = Number(new Date(sess.cookie.expires)) - Date.now()
    //     ttl = Math.ceil(ms / 1000)
    //   } else {
    //     ttl = this.ttl
    //   }
    //   return ttl
    // }
  }

  return MysqlXStore
}

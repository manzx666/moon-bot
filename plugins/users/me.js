module.exports = {
   help: ['me'],
   tags: ['user'],
   run: async (m, {
      conn,
      usedPrefix,
      blockList,
      env,
      Func
   }) => {
      let user = global.db.users[m.sender]
      let _own = [...new Set([env.owner, ...global.db.setting.owners])]
      let pic = await conn.profilePictureUrl(m.sender, 'image') || await Func.fetchBuffer('./src/image/default.jpg')
      let blocked = blockList.includes(m.sender) ? true : false
      let now = new Date() * 1
      let lastseen = (user.lastseen == 0) ? 'Never' : Func.toDate(now - user.lastseen)
      let usebot = (user.usebot == 0) ? 'Never' : Func.toDate(now - user.usebot)
      let caption = `乂  *U S E R - P R O F I L E*\n\n`
      caption += `   ◦  *Name* : ${m.name}\n`
      caption += `   ◦  *Exp* : ${Func.formatNumber(user.exp)}\n`
      caption += `   ◦  *Money* : ${Func.formatNumber(user.money)}\n`
      caption += `   ◦  *Limit* : ${Func.formatNumber(user.limit)}\n`
      caption += `   ◦  *Hitstat* : ${Func.formatNumber(user.hit)}\n`
      caption += `   ◦  *Warning* : ${((m.isGroup) ? (typeof global.db.groups[m.chat].member[m.sender] != 'undefined' ? global.db.groups[m.chat].member[m.sender].warning : 0) + ' / 5' : user.warning + ' / 5')}\n\n`
      caption += `乂  *U S E R - S T A T U S*\n\n`
      caption += `   ◦  *Blocked* : ${(blocked ? '√' : '×')}\n`
      caption += `   ◦  *Banned* : ${(new Date - user.ban_temporary < env.timer) ? Func.toTime(new Date(user.ban_temporary + env.timeout) - new Date()) + ' (' + ((env.timeout / 1000) / 60) + ' min)' : user.banned ? '√' : '×'}\n`
      caption += `   ◦  *Use In Private* : ${(Object.keys(global.db.chats).includes(m.sender) ? '√' : '×')}\n`
      caption += `   ◦  *Premium* : ${(user.premium ? '√' : '×')}\n`
      caption += `   ◦  *Expired* : ${user.expired == 0 ? '-' : Func.timeReverse(user.expired - new Date() * 1)}\n`
      caption += `   ◦  *Verified* : ${(user.registered ? '√' : '×')}\n\n`
      caption += global.footer
      conn.sendMessageModify(m.chat, caption, m, {
         largeThumb: true,
         thumbnail: pic
      })
   }
}
const fs = require('fs')
module.exports = {
   command: /^(menu|help)$/i,
   run: async (m, {
      conn,
      usedPrefix: _p,
      command,
      text,
      args,
      env,
      setting,
      plugins,
      Func
   }) => {
      try {
         conn.menu = conn.menu ? conn.menu : {}
         const style = setting.style
         const local_size = fs.existsSync('./database.json') ? await Func.getSize(fs.statSync('./database.json').size) : ''
         const message = setting.msg.replace('+tag', `@${m.sender.replace(/@.+/g, '')}`).replace('+name', m.name).replace('+greeting', Func.greeting()).replace('+db', (/mongo/.test(env.databaseurl) ? 'MongoDB' : `Local : ${local_size}`))
         if (style === 1) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
            let cmd = Object.fromEntries(filter)
            let category = []

            for (let name in cmd) {
               let obj = cmd[name]
               if (!obj) continue
               if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
               if (Object.keys(category).includes(obj.tags[0])) {
                  category[obj.tags[0]].push(obj)
               } else {
                  category[obj.tags[0]] = []
                  category[obj.tags[0]].push(obj)
               }
            }

            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)

            for (let k of keys) {
               print += '\n\n乂  *' + k.toUpperCase().split('').join(' ') + '*\n\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(k))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) continue

               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.help.constructor.name) {
                     case 'Array':
                        v.help.map(x => commands.push({
                           usage: x,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        }))
                        break;
                     case 'String':
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `	◦  ${_p + v.usage} ${v.use}`).join('\n')
            }

            conn.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               thumbnail: setting.cover,
               url: setting.link
            })
         } else if (style === 2) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
            let cmd = Object.fromEntries(filter)
            let category = {}

            for (let name in cmd) {
               let obj = cmd[name]
               if (!obj) continue
               if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
               if (Object.keys(category).includes(obj.tags[0])) {
                  category[obj.tags[0]].push(obj)
               } else {
                  category[obj.tags[0]] = [obj]
               }
            }

            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)

            for (let k of keys) {
               print += '\n\n –  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(k))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) continue

               let commands = []
               cmd.map(([_, v]) => {
                  if (v.help) {  // Memastikan v.help ada
                     switch (v.help.constructor.name) {
                        case 'Array':
                           v.help.map(x => commands.push({
                              usage: x,
                              use: v.use ? Func.texted('bold', v.use) : ''
                           }))
                           break
                        case 'String':
                           commands.push({
                              usage: v.help,
                              use: v.use ? Func.texted('bold', v.use) : ''
                           })
                     }
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`;
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`;
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`;
                  }
               }).join('\n')
            }

            conn.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               thumbnail: setting.cover,
               url: setting.link
            })
         } else if (style === 3) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(text.trim().toLowerCase()) && !setting.hidden.includes(v.tags[0]))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.forEach(([_, v]) => {
                  switch (v.help.constructor.name) {
                     case 'Array':
                        v.help.forEach(x => commands.push({
                           usage: x,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(print)
            } else {
               let print = message
               print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
               let cmd = Object.fromEntries(filter)
               let category = {}
               for (let name in cmd) {
                  let obj = cmd[name]
                  if (!obj) continue
                  if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
                  if (Object.keys(category).includes(obj.tags[0])) {
                     category[obj.tags[0]].push(obj)
                  } else {
                     category[obj.tags[0]] = [obj]
                  }
               }
               const keys = Object.keys(category).sort()
               print += keys.map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + command} ${v}`
                  } else if (i == keys.length - 1) {
                     return `└  ◦  ${_p + command} ${v}`
                  } else {
                     return `│  ◦  ${_p + command} ${v}`
                  }
               }).join('\n')
               conn.sendMessageModify(m.chat, print + '\n\n' + global.footer, m, {
                  ads: false,
                  largeThumb: true,
                  thumbnail: setting.cover,
                  url: setting.link
               })
            }
         } else if (style === 4) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(text.trim().toLowerCase()) && !setting.hidden.includes(v.tags[0]))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = [];
               cmd.forEach(([_, v]) => {
                  switch (v.help.constructor.name) {
                     case 'Array':
                        v.help.forEach(x => commands.push({
                           usage: x,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(print)
            } else {
               let print = message
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
               let cmd = Object.fromEntries(filter)
               let category = {}
               for (let name in cmd) {
                  let obj = cmd[name]
                  if (!obj) continue
                  if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
                  if (Object.keys(category).includes(obj.tags[0])) {
                     category[obj.tags[0]].push(obj)
                  } else {
                     category[obj.tags[0]] = [obj]
                  }
               }
               const keys = Object.keys(category).sort()
               let sections = []
               const label = {
                  highlight_label: 'Many Used'
               }
               keys.sort((a, b) => a.localeCompare(b)).forEach((v, i) => sections.push({
                  ...(/download|conver|util/.test(v) ? label : {}),
                  rows: [{
                     title: Func.ucword(v),
                     description: `There are ${Func.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.help && x.tags && x.tags.includes(v.trim().toLowerCase())).map(([_, x]) => x.help)).length} commands`,
                     id: `${_p + command} ${v}`
                  }]
               }))
               const buttons = [{
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'Tap Here!',
                     sections
                  })
               }]
               conn.sendIAMessage(m.chat, buttons, m, {
                  header: '',
                  content: print,
                  footer: global.footer,
                  media: global.db.setting.cover
               })
            }
         } else if (style === 5) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
            let cmd = Object.fromEntries(filter)
            let category = []

            for (let name in cmd) {
               let obj = cmd[name]
               if (!obj) continue
               if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
               if (Object.keys(category).includes(obj.tags[0])) {
                  category[obj.tags[0]].push(obj)
               } else {
                  category[obj.tags[0]] = []
                  category[obj.tags[0]].push(obj)
               }
            }

            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)

            for (let k of keys) {
               print += '\n\n乂  *' + k.toUpperCase().split('').join(' ') + '*\n\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(k))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) continue

               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.help.constructor.name) {
                     case 'Array':
                        v.help.map(x => commands.push({
                           usage: x,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        }))
                        break;
                     case 'String':
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `	◦  ${_p + v.usage} ${v.use}`).join('\n')
            }

            conn.sendMessageModify(m.chat, Func.Styles(print) + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               thumbnail: setting.cover,
               url: setting.link
            })
         } else if (style === 6) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
            let cmd = Object.fromEntries(filter)
            let category = {}

            for (let name in cmd) {
               let obj = cmd[name]
               if (!obj) continue
               if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
               if (Object.keys(category).includes(obj.tags[0])) {
                  category[obj.tags[0]].push(obj)
               } else {
                  category[obj.tags[0]] = [obj]
               }
            }

            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)

            for (let k of keys) {
               print += '\n\n –  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(k))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) continue

               let commands = []
               cmd.map(([_, v]) => {
                  if (v.help) {  // Memastikan v.help ada
                     switch (v.help.constructor.name) {
                        case 'Array':
                           v.help.map(x => commands.push({
                              usage: x,
                              use: v.use ? Func.texted('bold', v.use) : ''
                           }))
                           break
                        case 'String':
                           commands.push({
                              usage: v.help,
                              use: v.use ? Func.texted('bold', v.use) : ''
                           })
                     }
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`;
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`;
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`;
                  }
               }).join('\n')
            }

            conn.sendMessageModify(m.chat, Func.Styles(print) + '\n\n' + global.footer, m, {
               ads: false,
               largeThumb: true,
               thumbnail: setting.cover,
               url: setting.link
            })
         } else if (style === 7) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(text.trim().toLowerCase()) && !setting.hidden.includes(v.tags[0]))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.forEach(([_, v]) => {
                  switch (v.help.constructor.name) {
                     case 'Array':
                        v.help.forEach(x => commands.push({
                           usage: x,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(Func.Styles(print))
            } else {
               let print = message
               print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
               let cmd = Object.fromEntries(filter)
               let category = {}
               for (let name in cmd) {
                  let obj = cmd[name]
                  if (!obj) continue
                  if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
                  if (Object.keys(category).includes(obj.tags[0])) {
                     category[obj.tags[0]].push(obj)
                  } else {
                     category[obj.tags[0]] = [obj]
                  }
               }
               const keys = Object.keys(category).sort()
               print += keys.map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + command} ${v}`
                  } else if (i == keys.length - 1) {
                     return `└  ◦  ${_p + command} ${v}`
                  } else {
                     return `│  ◦  ${_p + command} ${v}`
                  }
               }).join('\n')
               conn.sendMessageModify(m.chat, Func.Styles(print) + '\n\n' + global.footer, m, {
                  ads: false,
                  largeThumb: true,
                  thumbnail: setting.cover,
                  url: setting.link
               })
            }
         } else if (style === 8) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.help && v.tags && v.tags.includes(text.trim().toLowerCase()) && !setting.hidden.includes(v.tags[0]))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.forEach(([_, v]) => {
                  switch (v.help.constructor.name) {
                     case 'Array':
                        v.help.forEach(x => commands.push({
                           usage: x,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.help,
                           use: v.use ? Func.texted('bold', v.use) : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${_p + v.usage} ${v.use}`
                  } else if (i == commands.length - 1) {
                     return `└  ◦  ${_p + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${_p + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(Func.Styles(print))
            } else {
               let print = message;
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.help)
               let cmd = Object.fromEntries(filter)
               let category = {}
               for (let name in cmd) {
                  let obj = cmd[name]
                  if (!obj) continue
                  if (!obj.tags || setting.hidden.includes(obj.tags[0])) continue
                  if (Object.keys(category).includes(obj.tags[0])) {
                     category[obj.tags[0]].push(obj)
                  } else {
                     category[obj.tags[0]] = [obj]
                  }
               }
               const keys = Object.keys(category).sort()
               let sections = []
               const label = {
                  highlight_label: 'Many Used'
               }
               keys.sort((a, b) => a.localeCompare(b)).forEach((v, i) => sections.push({
                  ...(/download|conver|util/.test(v) ? label : {}),
                  rows: [{
                     title: Func.ucword(v),
                     description: `There are ${Func.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.help && x.tags && x.tags.includes(v.trim().toLowerCase())).map(([_, x]) => x.help)).length} commands`,
                     id: `${_p + command} ${v}`
                  }]
               }))
               const buttons = [{
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'Tap Here!',
                     sections
                  })
               }]
               conn.sendIAMessage(m.chat, buttons, m, {
                  header: '',
                  content: Func.Styles(print),
                  footer: global.footer,
                  media: global.db.setting.cover
               })
            }
         }
      } catch (e) {
         conn.reply(m.chat, Func.jsonFormat(e), m)
      }
   },
   exp: 3
}
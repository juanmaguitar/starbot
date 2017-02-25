'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('trending-github');
const IncomingWebhook = require('@slack/client').IncomingWebhook;

var webhook = new IncomingWebhook( config('WEBHOOK_URL') );

trending('weekly', 'javascript')
  .then( repos => {

    const msgDefaults = {
      text: 'Top 5 Repositories of Javascript this week are... ',
      responseType: 'in_channel',
      username: 'Starbot',
      iconEmoji: config('ICON_EMOJI')
    }

    console.log(repos)
    var orderedRepos = _.sortByOrder(repos, ['stars'], [true])
    console.log(orderedRepos)
    var attachments = orderedRepos.slice(0, 5).map((repo) => {
      return {
        title: `${repo.author}/${repo.name} `,
        title_link: repo.href,
        text: `_${repo.description}_\n${repo.language} • ⭐️ ${repo.stars} • 🍴️ ${repo.forks}`,
        mrkdwn_in: ['text', 'pretext']
      }
    })

    let msg = _.defaults({ attachments: attachments }, msgDefaults)

    webhook.send(msg, (err, res) => {
      if (err) throw err
      console.log(`\n🚀  Starbot report delivered 🚀`)
      console.log(msg)
      console.log(res)
      console.log(config('WEBHOOK_URL') )
    })
  })
  .catch( function(err) {
    throw err
  })

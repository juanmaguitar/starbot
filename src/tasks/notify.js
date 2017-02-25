'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('trending-github');
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const language = 'javascript'

var webhook = new IncomingWebhook( config('WEBHOOK_URL') );

trending('weekly', language)
  .then( repos => {

    const msgDefaults = {
      text: `Top 5 Repositories${ language ? ' of ' + language.toUpperCase() : '' } this week are... `,
      responseType: 'in_channel',
      username: 'Starbot',
      iconEmoji: config('ICON_EMOJI')
    }

    var orderedRepos = _.orderBy(repos, ['stars'], ['desc'])
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
    })
  })
  .catch( function(err) {
    throw err
  })

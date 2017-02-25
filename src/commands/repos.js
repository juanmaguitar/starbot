'use strict'

const _ = require('lodash')
const config = require('../config')
const trending = require('trending-github');

const handler = (payload, res) => {

  const language = payload.text.split(' ')[1]

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

      let msg = _.defaults({
        channel: payload.channel_name,
        attachments: attachments
      }, msgDefaults)

      res.set('content-type', 'application/json')
      res.status(200).json(msg)
      return

    })
    .catch( function(err) {
      throw err
    })
}

module.exports = { pattern: /repos/ig, handler: handler }

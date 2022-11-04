import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType, ErrorType } from 'structures/enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('duck')
    .setDescription('Displays a random duck.'),
  type: CommandType.Fun,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : undefined

    try {
      const res = await fetch('https://random-d.uk/api/v2/random')
      const image = ((await res.json()) as { url: string }).url

      const embed = new EmbedBuilder()
        .setTitle('🦆  Quack!  🦆')
        .setColor(
          guild?.members.me?.displayHexColor ||
            client.user?.hexAccentColor ||
            null,
        )
        .setImage(image)
        .setFooter({
          text: member?.displayName || user.username,
          iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
        })
        .setTimestamp()

      await client.reply(interaction, { embeds: [embed] })
    } catch (err) {
      await client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        `Sorry ${member}, please try again later.`,
      )
    }
  },
})

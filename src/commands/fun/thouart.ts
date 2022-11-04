import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType, ErrorType } from 'structures/enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('thouart')
    .setDescription('Insults a user in an Elizabethan way.')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to insult.')
        .setRequired(false),
    ),
  type: CommandType.Fun,
  run: async (client, interaction): Promise<void> => {
    const { guild } = interaction
    const { targetUser, targetMember, user, member } =
      await Command.getTargetUserOrMemberOrSelf(interaction)

    try {
      const res = await fetch('http://quandyfactory.com/insult/json/')
      let insult = ((await res.json()) as { insult: string }).insult
      insult = insult.charAt(0).toLowerCase() + insult.slice(1)

      const embed = new EmbedBuilder()
        .setTitle('🎭  Thou Art  🎭')
        .setColor(
          guild?.members.me?.displayHexColor ||
            client.user?.hexAccentColor ||
            null,
        )
        .setDescription(`${targetMember || targetUser}, ${insult}`)
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

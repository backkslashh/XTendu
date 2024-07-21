const { SlashCommandBuilder } = require("discord.js");

function hasManageMessagesPermission(member) {
  return member.permissions.has("MANAGE_MESSAGES");
}

function isValidDeleteCount(count) {
  return count >= 1 && count <= 100;
}

function sendEphemeralReply(interaction, message) {
  interaction.reply({
    content: message,
    ephemeral: true,
  });
}

async function deleteAllMessages(channel) {
  let fetched;
  do {
    fetched = await channel.messages.fetch({ limit: 100 });
    await channel.bulkDelete(fetched, true);
  } while (fetched.size >= 2);
}

async function deleteSpecificMessages(channel, amount) {
  try {
    const deletedMessages = await channel.bulkDelete(amount, true);
    return deletedMessages.size;
  } catch (err) {
    throw new Error(
      "There was an error trying to delete messages in this channel!"
    );
  }
}

async function handleDeleteAllMessages(interaction) {
  try {
    await deleteAllMessages(interaction.channel);
    sendEphemeralReply(interaction, "Successfully Deleted All Messages");
  } catch (err) {
    console.error(err);
    sendEphemeralReply(interaction, err.message);
  }
}

async function handleDeleteSpecificMessages(interaction, amount) {
  try {
    const deletedSize = await deleteSpecificMessages(
      interaction.channel,
      amount
    );
    sendEphemeralReply(
      interaction,
      `Successfully deleted ${deletedSize} messages.`
    );
  } catch (err) {
    console.error(err);
    sendEphemeralReply(interaction, err.message);
  }
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription(
      "Deletes a specified number of messages from the channel or all messages if 'all' is specified."
    )
    .addStringOption((option) =>
      option
        .setName("amount")
        .setDescription(
          "The number of messages to delete or 'all' to delete all messages"
        )
        .setRequired(true)
    ),
  async execute(interaction) {
    const amountInput = interaction.options.getString("amount");

    if (!hasManageMessagesPermission(interaction.member)) {
      return sendEphemeralReply(
        interaction,
        "You do not have permissions to use this command."
      );
    }

    if (amountInput.toLowerCase() === "all") {
      await handleDeleteAllMessages(interaction);
    } else {
      const amount = parseInt(amountInput, 10);

      if (!isValidDeleteCount(amount)) {
        return sendEphemeralReply(
          interaction,
          'You need to specify a number between 1 and 100, or "All"'
        );
      }

      await handleDeleteSpecificMessages(interaction, amount);
    }
  },
};

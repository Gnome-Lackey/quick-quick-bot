# quick-quick-bot

The trusted quick-quick gnome lackey is a bot to aid all DM/GMs when they need to think of something on the spot. We've all been there before as DM/GMs. That dreaded moment when a player asks you, "what's this orc's name?" The panic takes hold of you causing you to fumble through loose papers, "her name? Oh yes her name, let me tell you her name. It's, uhhh, Furby the Great." The players laugh, while you facepalm and write down Furby on a note somewhere.

That's where this bot comes in. No longer will you have to worry about name generation! Quick-Quick, your trusty gnome lackey, will do the work for you. Just give him a command, and he'll come up with something on the spot for you to impress your party. Instead of hearing "Peter? His name is Peter? That's so basic." you'll hear "Oh wow Sigard Sundafyllir, that's a baller name, did you just think of that?"

## Using Quick-Quick to Generate Names

To generate random names with quick-quick all you need to do is type the following in a channel where the bot is included.

```text
!qq name
```

It will respond with a name for each race (humans will default to english), like so:

![example](./images/name_command_example.png)

If you need something more specific, there are a number of arguments that you can supply quick-quick with to narrow down the search, such as:

1) gender
2) race
3) language (human only)
4) count

To use these arguments just add the value after the command, like so:

```text
!qq name dwarf male 4
```

This will give you something like the following:

![example](./images/name_specific_command_example.png)

## Using Quick-Quick to Generate NPC

To generate a random NPC with quick-quick all you need to do is type the following in a channel where the bot is included.

```text
!qq npc
```

It will respond with a new NPC, like so:

![example](./images/npc_command_example.png)

If you need something more specific, there are a number of arguments that you can supply quick-quick with to narrow down the search, such as:

1) gender
2) race

To use these arguments just add the value after the command, like so:

```text
!qq npc dwarf male
```

This will give you something like the following:

![example](./images/npc_specific_command_example.png)

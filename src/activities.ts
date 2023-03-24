import { NewsPiece } from './models/newsPiece';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import newsletterEmail from './templates/newsletterTemplate';
const OAuth2 = google.auth.OAuth2;
// const OAuth2: Auth.OAuth2Client = new google.auth.OAuth2();
// type OAuth2 = typeof google.auth.OAuth2.prototype;
// import { GoogleOAuth2Client } from './google/types';

export async function sendNewsletter(): Promise<string> {
  // Fetch news
  let fetchedNews;
  try {
    const url = 'https://newsapi.org/v2/top-headlines?country=eg&apiKey=663929eec90b442e947f03458c17075b';

    const news = await axios.get(url);
    fetchedNews = news.data.articles;
  } catch (error: any) {
    return 'Failed to fetch news';
  }

  // const fetchedNews: NewsPiece[] = [
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Al Masry Al Youm - المصري اليوم',
  //     title:
  //       'أسعار الذهب اليوم الخميس 23-3-2023 في مصر.. الآن مفاجآت عيار 21 بيع وشراء بالمصنعية - Al Masry Al Youm - المصري اليوم',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMiMmh0dHBzOi8vd3d3LmFsbWFzcnlhbHlvdW0uY29tL25ld3MvZGV0YWlscy8yODQ4NjM50gEA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-23T05:43:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'اليوم السابع',
  //     title: 'الصين تعلن إبعاد مدمرة أمريكية من البحر الجنوبى.. والبحرية الأمريكية تنفى - اليوم السابع',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMijQNodHRwczovL3d3dy55b3VtNy5jb20vc3RvcnkvMjAyMy8zLzIzLyVEOCVBNyVEOSU4NCVEOCVCNSVEOSU4QSVEOSU4Ni0lRDglQUElRDglQjklRDklODQlRDklODYtJUQ4JUE1JUQ4JUE4JUQ4JUI5JUQ4JUE3JUQ4JUFGLSVEOSU4NSVEOCVBRiVEOSU4NSVEOCVCMSVEOCVBOS0lRDglQTMlRDklODUlRDglQjElRDklOEElRDklODMlRDklOEElRDglQTktJUQ5JTg1JUQ5JTg2LSVEOCVBNyVEOSU4NCVEOCVBOCVEOCVBRCVEOCVCMS0lRDglQTclRDklODQlRDglQUMlRDklODYlRDklODglRDglQTglRDklODktJUQ5JTg4JUQ4JUE3JUQ5JTg0JUQ4JUE4JUQ4JUFEJUQ4JUIxJUQ5JThBJUQ4JUE5LSVEOCVBNyVEOSU4NCVEOCVBMyVEOSU4NSVEOCVCMSVEOSU4QSVEOSU4MyVEOSU4QSVEOCVBOS82MTI0OTEx0gGJA2h0dHBzOi8vbS55b3VtNy5jb20vYW1wLzIwMjMvMy8yMy8lRDglQTclRDklODQlRDglQjUlRDklOEElRDklODYtJUQ4JUFBJUQ4JUI5JUQ5JTg0JUQ5JTg2LSVEOCVBNSVEOCVBOCVEOCVCOSVEOCVBNyVEOCVBRi0lRDklODUlRDglQUYlRDklODUlRDglQjElRDglQTktJUQ4JUEzJUQ5JTg1JUQ4JUIxJUQ5JThBJUQ5JTgzJUQ5JThBJUQ4JUE5LSVEOSU4NSVEOSU4Ni0lRDglQTclRDklODQlRDglQTglRDglQUQlRDglQjEtJUQ4JUE3JUQ5JTg0JUQ4JUFDJUQ5JTg2JUQ5JTg4JUQ4JUE4JUQ5JTg5LSVEOSU4OCVEOCVBNyVEOSU4NCVEOCVBOCVEOCVBRCVEOCVCMSVEOSU4QSVEOCVBOS0lRDglQTclRDklODQlRDglQTMlRDklODUlRDglQjElRDklOEElRDklODMlRDklOEElRDglQTkvNjEyNDkxMQ?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-23T05:37:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Sada El-Bald صدى البلد',
  //     title: 'البانيه رخص 70 جنيهًا.. هزة قوية تضرب أسعار الدواجن أول يوم رمضان - Sada El-Bald صدى البلد',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMiIGh0dHBzOi8vd3d3LmVsYmFsYWQubmV3cy81NzAwNjU10gEA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-23T05:16:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Sky News Arabia سكاي نيوز عربية',
  //     title: 'باخموت.. كيف زار زيلينيسكي المدينة وهي تحت الحصار؟ - Sky News Arabia سكاي نيوز عربية',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMigwJodHRwczovL3d3dy5za3luZXdzYXJhYmlhLmNvbS93b3JsZC8xNjA3MzEzLSVEOCVBOCVEOCVBNyVEOCVBRSVEOSU4NSVEOSU4OCVEOCVBQS0lRDglQjIlRDglQTclRDglQjEtJUQ4JUIyJUQ5JThBJUQ5JTg0JUQ5JThBJUQ5JTg2JUQ5JThBJUQ4JUIzJUQ5JTgzJUQ5JThBLSVEOCVBNyVEOSU4NCVEOSU4NSVEOCVBRiVEOSU4QSVEOSU4NiVEOCVBOS0lRDklODglRDklODclRDklOEEtJUQ4JUE3JUQ5JTg0JUQ4JUFEJUQ4JUI1JUQ4JUE3JUQ4JUIxJUQ4JTlG0gGHAmh0dHBzOi8vd3d3LnNreW5ld3NhcmFiaWEuY29tL2FtcC93b3JsZC8xNjA3MzEzLSVEOCVBOCVEOCVBNyVEOCVBRSVEOSU4NSVEOSU4OCVEOCVBQS0lRDglQjIlRDglQTclRDglQjEtJUQ4JUIyJUQ5JThBJUQ5JTg0JUQ5JThBJUQ5JTg2JUQ5JThBJUQ4JUIzJUQ5JTgzJUQ5JThBLSVEOCVBNyVEOSU4NCVEOSU4NSVEOCVBRiVEOSU4QSVEOSU4NiVEOCVBOS0lRDklODglRDklODclRDklOEEtJUQ4JUE3JUQ5JTg0JUQ4JUFEJUQ4JUI1JUQ4JUE3JUQ4JUIxJUQ4JTlG?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-23T04:45:53Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'اليوم السابع',
  //     title: 'الرئيس السيسي يصافح أحمد عمر هاشم خلال افتتاح مركز مصر الثقافى الإسلامى - اليوم السابع',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMixQJodHRwczovL3d3dy55b3VtNy5jb20vc3RvcnkvMjAyMy8zLzIzLyVEOCVBNyVEOSU4NCVEOCVCMSVEOCVBNiVEOSU4QSVEOCVCMy0lRDglQTclRDklODQlRDglQjMlRDklOEElRDglQjMlRDklOEEtJUQ5JThBJUQ4JUI1JUQ4JUE3JUQ5JTgxJUQ4JUFELSVEOCVBMyVEOCVBRCVEOSU4NSVEOCVBRi0lRDglQjklRDklODUlRDglQjEtJUQ5JTg3JUQ4JUE3JUQ4JUI0JUQ5JTg1LSVEOCVBRSVEOSU4NCVEOCVBNyVEOSU4NC0lRDglQTclRDklODElRDglQUElRDglQUElRDglQTclRDglQUQtJUQ5JTg1JUQ4JUIxJUQ5JTgzJUQ4JUIyLSVEOSU4NSVEOCVCNSVEOCVCMS82MTI0ODg10gHBAmh0dHBzOi8vbS55b3VtNy5jb20vYW1wLzIwMjMvMy8yMy8lRDglQTclRDklODQlRDglQjElRDglQTYlRDklOEElRDglQjMtJUQ4JUE3JUQ5JTg0JUQ4JUIzJUQ5JThBJUQ4JUIzJUQ5JThBLSVEOSU4QSVEOCVCNSVEOCVBNyVEOSU4MSVEOCVBRC0lRDglQTMlRDglQUQlRDklODUlRDglQUYtJUQ4JUI5JUQ5JTg1JUQ4JUIxLSVEOSU4NyVEOCVBNyVEOCVCNCVEOSU4NS0lRDglQUUlRDklODQlRDglQTclRDklODQtJUQ4JUE3JUQ5JTgxJUQ4JUFBJUQ4JUFBJUQ4JUE3JUQ4JUFELSVEOSU4NSVEOCVCMSVEOSU4MyVEOCVCMi0lRDklODUlRDglQjUlRDglQjEvNjEyNDg4NQ?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-23T01:49:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Al Masry Al Youm - المصري اليوم',
  //     title:
  //       'أمطار رعدية والصغرى 7.. الأرصاد تكشف حالة الطقس المتوقعة الخميس أول يوم رمضان - Al Masry Al Youm - المصري اليوم',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMiMmh0dHBzOi8vd3d3LmFsbWFzcnlhbHlvdW0uY29tL25ld3MvZGV0YWlscy8yODQ4NTc10gEA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-23T00:42:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'BBC Arabic',
  //     title: 'الفيدرالي الأمريكي يرفع أسعار الفائدة رغم اضطراب القطاع المصرفي - BBC Arabic',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMiLGh0dHBzOi8vd3d3LmJiYy5jb20vYXJhYmljL2J1c2luZXNzLTY1MDQ3NTg20gEA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-23T00:41:31Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'محتوى بلس',
  //     title: 'سعر موبايل اوبو رينو 6.. دلع نفسك بموبايل جديد في العيد - محتوى بلس',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMisQJodHRwczovL211aHR3YXBsdXMuY29tLzM2OTU0NC8yMDIzLzAzLzIzLyVEOCVCMyVEOCVCOSVEOCVCMS0lRDklODUlRDklODglRDglQTglRDglQTclRDklOEElRDklODQtJUQ4JUE3JUQ5JTg4JUQ4JUE4JUQ5JTg4LSVEOCVCMSVEOSU4QSVEOSU4NiVEOSU4OC02LSVEOCVBRiVEOSU4NCVEOCVCOS0lRDklODYlRDklODElRDglQjMlRDklODMtJUQ4JUE4JUQ5JTg1JUQ5JTg4JUQ4JUE4JUQ4JUE3JUQ5JThBJUQ5JTg0LSVEOCVBQyVEOCVBRiVEOSU4QSVEOCVBRi0lRDklODElRDklOEEtJUQ4JUE3JUQ5JTg0JUQ4JUI5JUQ5JThBJUQ4JUFGL9IBAA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T23:20:35Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'اليوم السابع',
  //     title: 'برج الحمل.. حظك اليوم الخميس 23 مارس: استعد للسفر - اليوم السابع',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMikAJodHRwczovL3d3dy55b3VtNy5jb20vc3RvcnkvMjAyMy8zLzIzLyVEOCVBOCVEOCVCMSVEOCVBQy0lRDglQTclRDklODQlRDglQUQlRDklODUlRDklODQtJUQ4JUFEJUQ4JUI4JUQ5JTgzLSVEOCVBNyVEOSU4NCVEOSU4QSVEOSU4OCVEOSU4NS0lRDglQTclRDklODQlRDglQUUlRDklODUlRDklOEElRDglQjMtMjMtJUQ5JTg1JUQ4JUE3JUQ4JUIxJUQ4JUIzLSVEOCVBNyVEOCVCMyVEOCVBQSVEOCVCOSVEOCVBRi0lRDklODQlRDklODQlRDglQjMlRDklODElRDglQjEvNjEyNDE2NtIBjAJodHRwczovL20ueW91bTcuY29tL2FtcC8yMDIzLzMvMjMvJUQ4JUE4JUQ4JUIxJUQ4JUFDLSVEOCVBNyVEOSU4NCVEOCVBRCVEOSU4NSVEOSU4NC0lRDglQUQlRDglQjglRDklODMtJUQ4JUE3JUQ5JTg0JUQ5JThBJUQ5JTg4JUQ5JTg1LSVEOCVBNyVEOSU4NCVEOCVBRSVEOSU4NSVEOSU4QSVEOCVCMy0yMy0lRDklODUlRDglQTclRDglQjElRDglQjMtJUQ4JUE3JUQ4JUIzJUQ4JUFBJUQ4JUI5JUQ4JUFGLSVEOSU4NCVEOSU4NCVEOCVCMyVEOSU4MSVEOCVCMS82MTI0MTY2?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T22:00:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'اليوم السابع',
  //     title: 'تنازل عن 520 ألف دولار.. الزمالك يعلن فسخ عقد فيريرا بالتراضى (فيديو) - اليوم السابع',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMingJodHRwczovL3d3dy55b3VtNy5jb20vc3RvcnkvMjAyMy8zLzIzLyVEOCVBQSVEOSU4NiVEOCVBNyVEOCVCMiVEOSU4NC0lRDglQjklRDklODYtNTIwLSVEOCVBMyVEOSU4NCVEOSU4MS0lRDglQUYlRDklODglRDklODQlRDglQTclRDglQjEtJUQ4JUE3JUQ5JTg0JUQ4JUIyJUQ5JTg1JUQ4JUE3JUQ5JTg0JUQ5JTgzLSVEOSU4QSVEOCVCOSVEOSU4NCVEOSU4Ni0lRDklODElRDglQjMlRDglQUUtJUQ4JUI5JUQ5JTgyJUQ4JUFGLSVEOSU4MSVEOSU4QSVEOCVCMSVEOSU4QSVEOCVCMSVEOCVBNy82MTI0ODAz0gGaAmh0dHBzOi8vbS55b3VtNy5jb20vYW1wLzIwMjMvMy8yMy8lRDglQUElRDklODYlRDglQTclRDglQjIlRDklODQtJUQ4JUI5JUQ5JTg2LTUyMC0lRDglQTMlRDklODQlRDklODEtJUQ4JUFGJUQ5JTg4JUQ5JTg0JUQ4JUE3JUQ4JUIxLSVEOCVBNyVEOSU4NCVEOCVCMiVEOSU4NSVEOCVBNyVEOSU4NCVEOSU4My0lRDklOEElRDglQjklRDklODQlRDklODYtJUQ5JTgxJUQ4JUIzJUQ4JUFFLSVEOCVCOSVEOSU4MiVEOCVBRi0lRDklODElRDklOEElRDglQjElRDklOEElRDglQjElRDglQTcvNjEyNDgwMw?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T22:00:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Masrawy - مصراوي',
  //     title: 'أسرة الطفل شنودة تروي ذكريات معمودية الطفل داخل الكنيسة - (فيديو) - Masrawy - مصراوي',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMihANodHRwczovL3d3dy5tYXNyYXd5LmNvbS9uZXdzL25ld3NfZWd5cHQvZGV0YWlscy8yMDIzLzMvMjIvMjM4NzcwMi8lRDglQTMlRDglQjMlRDglQjElRDglQTktJUQ4JUE3JUQ5JTg0JUQ4JUI3JUQ5JTgxJUQ5JTg0LSVEOCVCNCVEOSU4NiVEOSU4OCVEOCVBRiVEOCVBOS0lRDglQUElRDglQjElRDklODglRDklOEEtJUQ4JUIwJUQ5JTgzJUQ4JUIxJUQ5JThBJUQ4JUE3JUQ4JUFBLSVEOSU4NSVEOCVCOSVEOSU4NSVEOSU4OCVEOCVBRiVEOSU4QSVEOCVBOS0lRDglQTclRDklODQlRDglQjclRDklODElRDklODQtJUQ4JUFGJUQ4JUE3JUQ4JUFFJUQ5JTg0LSVEOCVBNyVEOSU4NCVEOSU4MyVEOSU4NiVEOSU4QSVEOCVCMyVEOCVBOS0lRDklODElRDklOEElRDglQUYlRDklOEElRDklODgt0gEA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T21:29:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Yallakora - يلاكورة',
  //     title: 'بحضور الدرندلي وحازم إمام.. منتخب مصر يواصل تدريباته استعدادًا لمالاوي - Yallakora - يلاكورة',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMioANodHRwczovL3d3dy55YWxsYWtvcmEuY29tL2Nhbi1xdWFsaWZpZXJzLzI3NDUvbmV3cy80NDI3MDIvJUQ4JUE4JUQ4JUFEJUQ4JUI2JUQ5JTg4JUQ4JUIxLSVEOCVBNyVEOSU4NCVEOCVBRiVEOCVCMSVEOSU4NiVEOCVBRiVEOSU4NCVEOSU4QS0lRDklODglRDglQUQlRDglQTclRDglQjIlRDklODUtJUQ4JUE1JUQ5JTg1JUQ4JUE3JUQ5JTg1LSVEOSU4NSVEOSU4NiVEOCVBQSVEOCVBRSVEOCVBOC0lRDklODUlRDglQjUlRDglQjEtJUQ5JThBJUQ5JTg4JUQ4JUE3JUQ4JUI1JUQ5JTg0LSVEOCVBQSVEOCVBRiVEOCVCMSVEOSU4QSVEOCVBOCVEOCVBNyVEOCVBQSVEOSU4Ny0lRDglQTclRDglQjMlRDglQUElRDglQjklRDglQUYlRDglQTclRDglQUYtJUQ4JUE3LSVEOSU4NCVEOSU4NSVEOCVBNyVEOSU4NCVEOCVBNyVEOSU4OCVEOSU4QdIBpANodHRwczovL3d3dy55YWxsYWtvcmEuY29tL2Nhbi1xdWFsaWZpZXJzLzI3NDUvbmV3cy80NDI3MDIvJUQ4JUE4JUQ4JUFEJUQ4JUI2JUQ5JTg4JUQ4JUIxLSVEOCVBNyVEOSU4NCVEOCVBRiVEOCVCMSVEOSU4NiVEOCVBRiVEOSU4NCVEOSU4QS0lRDklODglRDglQUQlRDglQTclRDglQjIlRDklODUtJUQ4JUE1JUQ5JTg1JUQ4JUE3JUQ5JTg1LSVEOSU4NSVEOSU4NiVEOCVBQSVEOCVBRSVEOCVBOC0lRDklODUlRDglQjUlRDglQjEtJUQ5JThBJUQ5JTg4JUQ4JUE3JUQ4JUI1JUQ5JTg0LSVEOCVBQSVEOCVBRiVEOCVCMSVEOSU4QSVEOCVBOCVEOCVBNyVEOCVBQSVEOSU4Ny0lRDglQTclRDglQjMlRDglQUElRDglQjklRDglQUYlRDglQTclRDglQUYtJUQ4JUE3LSVEOSU4NCVEOSU4NSVEOCVBNyVEOSU4NCVEOCVBNyVEOSU4OCVEOSU4QT9hbXA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T20:49:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Sky News Arabia سكاي نيوز عربية',
  //     title: 'نائب وزير الخارجية الروسي: الحرب النووية أقرب من أي وقت مضى - Sky News Arabia سكاي نيوز عربية',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMi2wJodHRwczovL3d3dy5za3luZXdzYXJhYmlhLmNvbS93b3JsZC8xNjA3MjgwLSVEOSU4NiVEOCVBNyVEOSU4QSVEOSU5NCVEOCVBOC0lRDklODglRDglQjIlRDklOEElRDglQjEtJUQ4JUE3JUQ5JTg0JUQ4JUFFJUQ4JUE3JUQ4JUIxJUQ4JUFDJUQ5JThBJUQ4JUE5LSVEOCVBNyVEOSU4NCVEOCVCMSVEOSU4OCVEOCVCMyVEOSU4QS0lRDglQTclRDklODQlRDglQUQlRDglQjElRDglQTgtJUQ4JUE3JUQ5JTg0JUQ5JTg2JUQ5JTg4JUQ5JTg4JUQ5JThBJUQ4JUE5LSVEOCVBNyVEOSU5NCVEOSU4MiVEOCVCMSVEOCVBOC0lRDglQTclRDklOTQlRDklOEEtJUQ5JTg4JUQ5JTgyJUQ4JUFBLSVEOSU4NSVEOCVCNiVEOSU4OdIB3wJodHRwczovL3d3dy5za3luZXdzYXJhYmlhLmNvbS9hbXAvd29ybGQvMTYwNzI4MC0lRDklODYlRDglQTclRDklOEElRDklOTQlRDglQTgtJUQ5JTg4JUQ4JUIyJUQ5JThBJUQ4JUIxLSVEOCVBNyVEOSU4NCVEOCVBRSVEOCVBNyVEOCVCMSVEOCVBQyVEOSU4QSVEOCVBOS0lRDglQTclRDklODQlRDglQjElRDklODglRDglQjMlRDklOEEtJUQ4JUE3JUQ5JTg0JUQ4JUFEJUQ4JUIxJUQ4JUE4LSVEOCVBNyVEOSU4NCVEOSU4NiVEOSU4OCVEOSU4OCVEOSU4QSVEOCVBOS0lRDglQTclRDklOTQlRDklODIlRDglQjElRDglQTgtJUQ4JUE3JUQ5JTk0JUQ5JThBLSVEOSU4OCVEOSU4MiVEOCVBQS0lRDklODUlRDglQjYlRDklODk?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T20:12:21Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'بوابة الأهرام',
  //     title: 'رمضان 2023.. موعد عرض مسلسل «جعفر العمدة» - بوابة الأهرام',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMiK2h0dHBzOi8vZ2F0ZS5haHJhbS5vcmcuZWcvTmV3cy80MTg0MDQ0LmFzcHjSAQA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T19:52:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Masrawy - مصراوي',
  //     title: '3 دول تعلن الجمعة أول أيام شهر رمضان - Masrawy - مصراوي',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMi8wFodHRwczovL3d3dy5tYXNyYXd5LmNvbS9yYW1hZGFuL3JlcG9ydHMvZGV0YWlscy8yMDIzLzMvMjIvMjM4NzYyOC8zLSVEOCVBRiVEOSU4OCVEOSU4NC0lRDglQUElRDglQjklRDklODQlRDklODYtJUQ4JUE3JUQ5JTg0JUQ4JUFDJUQ5JTg1JUQ4JUI5JUQ4JUE5LSVEOCVBMyVEOSU4OCVEOSU4NC0lRDglQTMlRDklOEElRDglQTclRDklODUtJUQ4JUI0JUQ5JTg3JUQ4JUIxLSVEOCVCMSVEOSU4NSVEOCVCNiVEOCVBNyVEOSU4Ni3SAfcBaHR0cHM6Ly93d3cubWFzcmF3eS5jb20vcmFtYWRhbi9yZXBvcnRzL2RldGFpbHMvMjAyMy8zLzIyLzIzODc2MjgvMy0lRDglQUYlRDklODglRDklODQtJUQ4JUFBJUQ4JUI5JUQ5JTg0JUQ5JTg2LSVEOCVBNyVEOSU4NCVEOCVBQyVEOSU4NSVEOCVCOSVEOCVBOS0lRDglQTMlRDklODglRDklODQtJUQ4JUEzJUQ5JThBJUQ4JUE3JUQ5JTg1LSVEOCVCNCVEOSU4NyVEOCVCMS0lRDglQjElRDklODUlRDglQjYlRDglQTclRDklODYtP2FtcA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T19:34:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Masrawy - مصراوي',
  //     title: 'مواعيد عرض مسلسلات رمضان 2023 على جميع القنوات (تغطية محدثة) - Masrawy - مصراوي',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMi4QJodHRwczovL3d3dy5tYXNyYXd5LmNvbS9yYW1hZGFuL2RyYW1hLW5ld3MvZGV0YWlscy8yMDIzLzMvMjIvMjM4NzYyMi8lRDklODUlRDklODglRDglQTclRDglQjklRDklOEElRDglQUYtJUQ4JUI5JUQ4JUIxJUQ4JUI2LSVEOSU4NSVEOCVCMyVEOSU4NCVEOCVCMyVEOSU4NCVEOCVBNyVEOCVBQS0lRDglQjElRDklODUlRDglQjYlRDglQTclRDklODYtMjAyMy0lRDglQjklRDklODQlRDklODktJUQ4JUFDJUQ5JTg1JUQ5JThBJUQ4JUI5LSVEOCVBNyVEOSU4NCVEOSU4MiVEOSU4NiVEOSU4OCVEOCVBNyVEOCVBQS0lRDglQUElRDglQkElRDglQjclRDklOEElRDglQTktJUQ5JTg1JUQ4JUFEJUQ4JUFGJUQ4JUFCJUQ4JUE5LdIB5QJodHRwczovL3d3dy5tYXNyYXd5LmNvbS9yYW1hZGFuL2RyYW1hLW5ld3MvZGV0YWlscy8yMDIzLzMvMjIvMjM4NzYyMi8lRDklODUlRDklODglRDglQTclRDglQjklRDklOEElRDglQUYtJUQ4JUI5JUQ4JUIxJUQ4JUI2LSVEOSU4NSVEOCVCMyVEOSU4NCVEOCVCMyVEOSU4NCVEOCVBNyVEOCVBQS0lRDglQjElRDklODUlRDglQjYlRDglQTclRDklODYtMjAyMy0lRDglQjklRDklODQlRDklODktJUQ4JUFDJUQ5JTg1JUQ5JThBJUQ4JUI5LSVEOCVBNyVEOSU4NCVEOSU4MiVEOSU4NiVEOSU4OCVEOCVBNyVEOCVBQS0lRDglQUElRDglQkElRDglQjclRDklOEElRDglQTktJUQ5JTg1JUQ4JUFEJUQ4JUFGJUQ4JUFCJUQ4JUE5LT9hbXA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T19:32:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Al Masry Al Youm - المصري اليوم',
  //     title:
  //       'ميكالي يعلق على فوز المنتخب الأولمبي وإحتمالية مشاركة محمد صلاح في الأولمبياد - Al Masry Al Youm - المصري اليوم',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMiMmh0dHBzOi8vd3d3LmFsbWFzcnlhbHlvdW0uY29tL25ld3MvZGV0YWlscy8yODQ4MzIz0gEA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T19:16:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'اليوم السابع',
  //     title: 'عرض مسلسل "الكبير أوى 7" على on يوميا فى السادسة والربع مساء - اليوم السابع',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMihgJodHRwczovL3d3dy55b3VtNy5jb20vc3RvcnkvMjAyMy8zLzIyLyVEOCVCOSVEOCVCMSVEOCVCNi0lRDklODUlRDglQjMlRDklODQlRDglQjMlRDklODQtJUQ4JUE3JUQ5JTg0JUQ5JTgzJUQ4JUE4JUQ5JThBJUQ4JUIxLSVEOCVBMyVEOSU4OCVEOSU4OS03LSVEOCVCOSVEOSU4NCVEOSU4OS1vbi0lRDklOEElRDklODglRDklODUlRDklOEElRDglQTctJUQ5JTgxJUQ5JTg5LSVEOCVBNyVEOSU4NCVEOCVCMyVEOCVBNyVEOCVBRiVEOCVCMyVEOCVBOS82MTI0Njc00gGCAmh0dHBzOi8vbS55b3VtNy5jb20vYW1wLzIwMjMvMy8yMi8lRDglQjklRDglQjElRDglQjYtJUQ5JTg1JUQ4JUIzJUQ5JTg0JUQ4JUIzJUQ5JTg0LSVEOCVBNyVEOSU4NCVEOSU4MyVEOCVBOCVEOSU4QSVEOCVCMS0lRDglQTMlRDklODglRDklODktNy0lRDglQjklRDklODQlRDklODktb24tJUQ5JThBJUQ5JTg4JUQ5JTg1JUQ5JThBJUQ4JUE3LSVEOSU4MSVEOSU4OS0lRDglQTclRDklODQlRDglQjMlRDglQTclRDglQUYlRDglQjMlRDglQTkvNjEyNDY3NA?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T19:11:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Sky News Arabia سكاي نيوز عربية',
  //     title: 'سقوط طائرة مسيرة إسرائيلية داخل سوريا - Sky News Arabia سكاي نيوز عربية',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMiiQJodHRwczovL3d3dy5za3luZXdzYXJhYmlhLmNvbS9taWRkbGUtZWFzdC8xNjA3MjU0LSVEOCVCMyVEOSU4MiVEOSU4OCVEOCVCNy0lRDglQjclRDglQTclRDklOEElRDklOTQlRDglQjElRDglQTktJUQ5JTg1JUQ4JUIzJUQ5JThBJUQ4JUIxJUQ4JUE5LSVEOCVBNyVEOSU5NSVEOCVCMyVEOCVCMSVEOCVBNyVEOSU4QSVEOSU5NCVEOSU4QSVEOSU4NCVEOSU4QSVEOCVBOS0lRDglQUYlRDglQTclRDglQUUlRDklODQtJUQ4JUIzJUQ5JTg4JUQ4JUIxJUQ5JThBJUQ4JUE30gGNAmh0dHBzOi8vd3d3LnNreW5ld3NhcmFiaWEuY29tL2FtcC9taWRkbGUtZWFzdC8xNjA3MjU0LSVEOCVCMyVEOSU4MiVEOSU4OCVEOCVCNy0lRDglQjclRDglQTclRDklOEElRDklOTQlRDglQjElRDglQTktJUQ5JTg1JUQ4JUIzJUQ5JThBJUQ4JUIxJUQ4JUE5LSVEOCVBNyVEOSU5NSVEOCVCMyVEOCVCMSVEOCVBNyVEOSU4QSVEOSU5NCVEOSU4QSVEOSU4NCVEOSU4QSVEOCVBOS0lRDglQUYlRDglQTclRDglQUUlRDklODQtJUQ4JUIzJUQ5JTg4JUQ4JUIxJUQ5JThBJUQ4JUE3?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T18:30:00Z',
  //     content: null,
  //   },
  //   {
  //     source: { id: 'google-news', name: 'Google News' },
  //     author: 'Sky News Arabia سكاي نيوز عربية',
  //     title: 'بعد 200 عام.. خصلات شعر بيتهوفن تكشف سبب وفاته - Sky News Arabia سكاي نيوز عربية',
  //     description: null,
  //     url: 'https://news.google.com/rss/articles/CBMi7gFodHRwczovL3d3dy5za3luZXdzYXJhYmlhLmNvbS92YXJpZXRpZXMvMTYwNzI0MS0yMDAtJUQ4JUI5JUQ4JUE3JUQ5JTg1LSVEOCVBRSVEOCVCNSVEOSU4NCVEOCVBNyVEOCVBQS0lRDglQjQlRDglQjklRDglQjEtJUQ4JUE4JUQ5JThBJUQ4JUFBJUQ5JTg3JUQ5JTg4JUQ5JTgxJUQ5JTg2LSVEOCVBQSVEOSU4MyVEOCVCNCVEOSU4MS0lRDglQjMlRDglQTglRDglQTgtJUQ5JTg4JUQ5JTgxJUQ4JUE3JUQ4JUFBJUQ5JTg30gHyAWh0dHBzOi8vd3d3LnNreW5ld3NhcmFiaWEuY29tL2FtcC92YXJpZXRpZXMvMTYwNzI0MS0yMDAtJUQ4JUI5JUQ4JUE3JUQ5JTg1LSVEOCVBRSVEOCVCNSVEOSU4NCVEOCVBNyVEOCVBQS0lRDglQjQlRDglQjklRDglQjEtJUQ4JUE4JUQ5JThBJUQ4JUFBJUQ5JTg3JUQ5JTg4JUQ5JTgxJUQ5JTg2LSVEOCVBQSVEOSU4MyVEOCVCNCVEOSU4MS0lRDglQjMlRDglQTglRDglQTgtJUQ5JTg4JUQ5JTgxJUQ4JUE3JUQ4JUFBJUQ5JTg3?oc=5',
  //     urlToImage: null,
  //     publishedAt: '2023-03-22T17:09:08Z',
  //     content: null,
  //   },
  // ];

  let arrayItems = '';
  fetchedNews?.map(
    (news: NewsPiece) =>
      (arrayItems =
        arrayItems +
          '<li style="list-style-type: none">' +
          '<p style="margin: 0 0 24px;">' +
          '<a href=' +
          news.url +
          '>' +
          news.title +
          '</a>' +
          '</p>' +
          '<p style="margin: 0 0 24px;">' +
          'by ' +
          news.author +
          ' at ' +
          news.publishedAt +
          '</p>' +
          '<p style="margin: 0 0 24px;">' +
          news.description ?? '' + '</p>' + '</li>')
  );

  const oauth2Client = new OAuth2(
    '252141412002-n0ncea5741k8frdu5ahhemb4ckv0rr2l.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token:
      '1//04Aqfd1EZA2ZyCgYIARAAGAQSNwF-L9Irpjciv0rxXjjoEweWhkSaV5cIlzAqwzDiA40REkJxFXJB-M5LaP8bgRyYSJtzlXzj3aE',
  });
  const accessToken: string = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err: any, token: any) => {
      if (err) {
        reject('Failed to create access token :(');
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
      user: 'yodawynewsletter@gmail.com',
      clientId: '252141412002-n0ncea5741k8frdu5ahhemb4ckv0rr2l.apps.googleusercontent.com',
      clientSecret: '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',
      accessToken,
    },
  };

  const transporter = nodemailer.createTransport(smtpConfig);
  const emailTemplate = newsletterEmail(arrayItems);

  try {
    await transporter.sendMail({
      from: 'yodawynewsletter@gmail.com',
      to: 'farahmohamedtemraz@gmail.com',
      subject: "Today's news",
      text: emailTemplate.text,
      html: emailTemplate.html,
    });
  } catch (error: any) {
    return 'Error in sending email';
  }

  return 'Success';
}

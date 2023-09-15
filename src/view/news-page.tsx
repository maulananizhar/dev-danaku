/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { Card } from "@/components/ui/card";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

function National() {
  const [news, setNews] = useState([]);

  async function newsFetcher() {
    try {
      const response = await axios.get(
        "https://berita-indo-api.vercel.app/v1/cnn-news/nasional"
      );
      setNews(response.data.data);
    } catch (err) {
      // console.error(err);
    }
  }

  useEffect(() => {
    newsFetcher();
  }, []);

  return (
    <>
      {news.map((data: any, index) => (
        <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2 flex" key={index}>
          <Card className="mx-2 my-2 dark:bg-[#191919] flex-1 dark:hover:bg-[#151515] duration-200">
            <Link
              className="flex flex-col py-4 px-4 group"
              href={data.link}
              target="_blank">
              <div className="flex-shrink-0">
                <img
                  src={data.image.large}
                  alt="main"
                  width={300}
                  height={200}
                  className="rounded-lg group-hover:brightness-75 duration-200"
                />
              </div>
              <div className="px-2 mt-4 flex-1">
                <p className="font-bold leading-5">{data.title}</p>
                <p className="opacity-80 text-sm mt-2">{data.contentSnippet}</p>
              </div>
            </Link>
          </Card>
        </div>
      ))}
    </>
  );
}

function All() {
  const [news, setNews] = useState([]);

  async function newsFetcher() {
    try {
      const response = await axios.get(
        "https://berita-indo-api.vercel.app/v1/cnn-news/"
      );
      setNews(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    newsFetcher();
  }, []);

  return (
    <>
      {news.map((data: any, index) => (
        <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2 flex" key={index}>
          <Card className="mx-2 my-2 dark:bg-[#191919] flex-1 dark:hover:bg-[#151515] duration-200">
            <Link
              className="flex flex-col py-4 px-4 group"
              href={data.link}
              target="_blank">
              <div className="flex-shrink-0">
                <img
                  src={data.image.large}
                  alt="main"
                  width={300}
                  height={200}
                  className="rounded-lg group-hover:brightness-75 duration-200"
                />
              </div>
              <div className="px-2 mt-4 flex-1">
                <p className="font-bold leading-5">{data.title}</p>
                <p className="opacity-80 text-sm mt-2">{data.contentSnippet}</p>
              </div>
            </Link>
          </Card>
        </div>
      ))}
    </>
  );
}

function Inter() {
  const [news, setNews] = useState([]);

  async function newsFetcher() {
    try {
      const response = await axios.get(
        "https://berita-indo-api.vercel.app/v1/cnn-news/internasional"
      );
      setNews(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    newsFetcher();
  }, []);

  return (
    <>
      {news.map((data: any, index) => (
        <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2 flex" key={index}>
          <Card className="mx-2 my-2 dark:bg-[#191919] flex-1 dark:hover:bg-[#151515] duration-200">
            <Link
              className="flex flex-col py-4 px-4 group"
              href={data.link}
              target="_blank">
              <div className="flex-shrink-0">
                <img
                  src={data.image.large}
                  alt="main"
                  width={300}
                  height={200}
                  className="rounded-lg group-hover:brightness-75 duration-200"
                />
              </div>
              <div className="px-2 mt-4 flex-1">
                <p className="font-bold leading-5">{data.title}</p>
                <p className="opacity-80 text-sm mt-2">{data.contentSnippet}</p>
              </div>
            </Link>
          </Card>
        </div>
      ))}
    </>
  );
}

function Sport() {
  const [news, setNews] = useState([]);

  async function newsFetcher() {
    try {
      const response = await axios.get(
        "https://berita-indo-api.vercel.app/v1/cnn-news/olahraga"
      );
      setNews(response.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    newsFetcher();
  }, []);

  return (
    <>
      {news.map((data: any, index) => (
        <div className="lg:w-1/4 md:w-1/2 w-full lg:my-0 my-2 flex" key={index}>
          <Card className="mx-2 my-2 dark:bg-[#191919] flex-1 dark:hover:bg-[#151515] duration-200">
            <Link
              className="flex flex-col py-4 px-4 group"
              href={data.link}
              target="_blank">
              <div className="flex-shrink-0">
                <img
                  src={data.image.large}
                  alt="main"
                  width={300}
                  height={200}
                  className="rounded-lg group-hover:brightness-75 duration-200"
                />
              </div>
              <div className="px-2 mt-4 flex-1">
                <p className="font-bold leading-5">{data.title}</p>
                <p className="opacity-80 text-sm mt-2">{data.contentSnippet}</p>
              </div>
            </Link>
          </Card>
        </div>
      ))}
    </>
  );
}

export const NewsPage = { All, National, Inter, Sport };

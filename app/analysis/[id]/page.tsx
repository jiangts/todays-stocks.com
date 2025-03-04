"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";
import { Icon } from "@mdi/react";
import { mdiMenu } from "@mdi/js";

interface StockData {
  Symbol: string;
  Name: string;
  Price: string;
  Change: string;
  "Change %": string;
  Volume: string;
  "Avg Vol (3M)": string;
  "Market Cap": string;
  "P/E Ratio (TTM)": string;
  "52 Wk Change %": string;
  category: string;
  thinking: string;
  reasoning: string;
  search: Array<{
    title: string;
    link: string;
    snippet: string;
  }>;
}

export default function AnalysisPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.clayos.ai/web/stock_losers/2025-02-11/output.json",
        );
        const result = await response.json();
        // Parse the search string back to array if needed
        const processedData = result.map((item: any) => ({
          ...item,
          search:
            typeof item.search === "string"
              ? JSON.parse(item.search)
              : item.search,
        }));
        setData(processedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Function to handle smooth scroll to hash
    const scrollToHash = () => {
      if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const target = document.getElementById(targetId);

        if (target) {
          window.scrollTo({
            top: target.offsetTop - 100,
            behavior: "smooth",
          });
        }
      }
    };

    // Initial scroll on component mount
    scrollToHash();

    const onHashChange = (e: HashChangeEvent) => {
      e.preventDefault();
      scrollToHash();
    };

    // Add event listener for hash changes
    window.addEventListener("hashchange", onHashChange);

    // Clean up event listener
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname, data]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex bg-base-200 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
      <div className="drawer lg:drawer-open">
        <input id="menu-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="w-full navbar bg-base-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 sticky top-0 z-10">
            <div className="flex-none lg:hidden">
              <label htmlFor="menu-drawer" className="btn btn-square btn-ghost">
                <Icon path={mdiMenu} size={1} />
              </label>
            </div>
            <div className="flex-1 px-2 mx-2 font-bold">Daily Stock Losers</div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-6">
            {data.map((stock) => (
              <div
                key={stock.Symbol}
                className="p-5 bg-base-100 dark:bg-gray-800 rounded-lg shadow-lg mb-5"
              >
                <h2
                  className="text-xl font-bold text-gray-800 dark:text-gray-200"
                  id={stock.Symbol}
                >
                  {stock.Symbol} -{" "}
                  <a
                    className="link"
                    href={`https://finance.yahoo.com/quote/${stock.Symbol}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {stock.Name}
                  </a>
                </h2>

                <div className="mt-3">
                  <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Stock Information
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">Price:</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        ${stock.Price}
                      </p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        Change:
                      </p>
                      <p className="text-xl font-bold text-red-500 dark:text-red-400">
                        {stock.Change} ({stock["Change %"]})
                      </p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        Volume:
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {stock.Volume}
                      </p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        Avg Vol (3M):
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {stock["Avg Vol (3M)"]}
                      </p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        Market Cap:
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {stock["Market Cap"]}
                      </p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        P/E Ratio (TTM):
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {stock["P/E Ratio (TTM)"]}
                      </p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        52 Wk Change:
                      </p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {stock["52 Wk Change %"]}
                      </p>
                    </div>
                    <div className="bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-gray-600 dark:text-gray-300">
                        Reason:
                      </p>
                      <p className="text-xl font-bold uppercase text-gray-900 dark:text-white">
                        {stock.category}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="collapse collapse-arrow bg-gray-100 dark:bg-gray-700 mt-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-md font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      AI Summary
                    </div>
                    <div className="collapse-content">
                      <p className="text-gray-700 dark:text-gray-300 mt-2 prose">
                        {stock.thinking}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="collapse collapse-arrow bg-gray-100 dark:bg-gray-700 mt-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-md font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      Why is {stock.Symbol} Down?
                    </div>
                    <div className="collapse-content">
                      <div
                        className="text-gray-700 dark:text-gray-300 prose"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(
                            marked(stock.reasoning, { breaks: true }) as string,
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="collapse collapse-arrow bg-gray-100 dark:bg-gray-700 mt-2">
                    <input type="checkbox" />
                    <div className="collapse-title text-md font-medium text-gray-900 dark:text-gray-100 flex items-center">
                      News
                    </div>
                    <div className="collapse-content space-y-3">
                      {stock.search.map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-md"
                        >
                          <a
                            href={item.link}
                            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                          >
                            {item.title}
                          </a>
                          <p
                            className="text-gray-600 dark:text-gray-300 mt-1"
                            dangerouslySetInnerHTML={{
                              __html: DOMPurify.sanitize(item.snippet),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="drawer-side z-20">
          <label htmlFor="menu-drawer" className="drawer-overlay"></label>
          <ul className="menu bg-base-100 dark:bg-gray-800 w-56 border-r border-gray-300 dark:border-gray-700">
            {data.map((stock) => (
              <li key={stock.Symbol}>
                <a
                  href={`#${stock.Symbol}`}
                  className="text-gray-900 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  {stock.Symbol} ({stock.category})
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

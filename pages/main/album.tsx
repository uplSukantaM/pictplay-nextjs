import { LockClosedIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

export default function Example() {
  const history = useRouter();
  const [userDetails, setUSerDetails] = useState({});
  const [albums, setAlbums] = useState([]);
  const goToMedia = (data: any) => {
    let userId = userDetails?._id;
    history.push({
      pathname: "/main/mediaPreview",
      search: `?userId=${userId}&albumId=${data?._id}`,
    });
  };
  useEffect(() => {
    let userDetails = JSON.parse(localStorage.getItem("user"));
    setUSerDetails(userDetails);
    const auth = localStorage.getItem("token");
    // console.log(userDetails._id);
  }, []);
  useEffect(() => {
    getAlbumList();
  }, [userDetails]);
  const returnCount = (data: any) => {
    let count = 0;
    if (data?.imageCount || data?.videoCount) {
      count = data?.imageCount + data?.videoCount;
    }
    return count;
  };

  const getAlbumList = () => {
    console.log("album api call album index");
    const auth = localStorage.getItem("token");
    const reqstValues: object = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: auth,
      },
    };
    fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_API_URL}/albums/${userDetails?._id}`,
      reqstValues
    )
      .then((result) => {
        if (result.status === 401) {
          history.push("/");
        } else {
          return result.json();
        }
      })
      .then((result) => {
        if (!result.error) {
          console.log(result);
          setAlbums(result.result);
        }
      })
      .catch((err: string) => {
        console.log(err);
      });
  };

  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap -m-4">
            {albums &&
              albums.length > 0 &&
              albums.map((item: any, index: number) => {
                return (
                  <div
                    className="lg:w-1/4 md:w-1/2 p-4 w-full"
                    key={index}
                    onClick={() => {
                      goToMedia(item);
                    }}
                  >
                    <a className="block relative h-48 rounded overflow-hidden">
                      <Image
                        alt="ecommerce"
                        className="object-cover object-center w-full h-full block"
                        src={
                          item?.thumbnail
                            ? `${process.env.NEXT_PUBLIC_MEDIA_API_URL}/uploads/?key=${item?.thumbnail?.key}&width=300&fit=cover`
                            : "/DefaultAlbum.svg"
                        }
                        layout="fill"
                        quality={100}
                        placeholder="blur"
                        blurDataURL="/DefaultAlbum.svg"
                        loading="lazy"
                      />
                    </a>
                    <div className="mt-4">
                      <h2 className="text-gray-900 title-font text-lg font-medium">
                        {item?.name}
                      </h2>
                      <p className="mt-1">{returnCount(item)} items</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import styles from "../../styles/media.module.css";

function mediaPreview() {
  const getQueryStringValue = (key: string) => {
    if (typeof window !== "undefined") {
    return decodeURIComponent(
      window.location.search.replace(
        new RegExp(
          "^(?:.*[&\\?]" +
            encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
            "(?:\\=([^&]*))?)?.*$",
          "i"
        ),
        "$1"
      )
    )}
  };
  const albumId = getQueryStringValue("albumId");
  const MATCH_URL_IMAGE = /\/(jpg|jpeg|png)($|\?)/i;
  const [imagePath, setImagePath] = useState([]);
  const getMedia = () => {
  
    console.log(albumId);

    const reqstValues: object = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    };
    fetch(
      `${process.env.NEXT_PUBLIC_MEDIA_API_URL}/medias/${albumId}?dataPerPage=300`,
      reqstValues
    )
      .then((result) => result.json())
      .then((result) => {
        if (!result.error) {
          // dispatch(mediaList(result.result));
          setImagePath(result.result);
          console.log(result);
        }
      })
      .catch((err: string) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getMedia();
  }, [albumId]);

  return (
    <div>
      <div className={styles.displayImage}>
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 3, 900: 4 }}>
          <Masonry columnsCount={5}>
            {imagePath &&
              imagePath.length > 0 &&
              imagePath.map((image: any, index: number) => {
                return (
                  <div className={styles.masonryImage} key={index}>
                    <img
                      src={
                        image?.mediaFile?.mimetype.includes("image") &&
                        `${process.env.NEXT_PUBLIC_MEDIA_API_URL}/uploads/?key=${image?.mediaFile?.key}&height=auto&width=200&fit=contain`
                      }
                    //   quality={100}
                      alt="media"
                    //   loading="lazy"
                    //   layout="responsive"
                    //   sizes="100"
                      height={'100%'}
                      width={'100%'}
                    //   placeholder="blur"
                    //   blurDataURL="/DefaultAlbum.svg"
                    />
                  </div>
                );
              })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </div>
  );
}

export default mediaPreview;

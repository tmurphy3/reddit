import React, { useState, useEffect } from "react";
import axios from "../axios";
import "../styles/newPost.css";
import { useStateValue } from "../stateprovider";
import Select from "react-select";
import moment from "moment";

function NewPost({
  setCreatePostForm,
  value,
  setValue,
  fromHome,
  setFromHome,
  pageUpdates,
  setPageUpdates,
}) {
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [{ user }] = useStateValue();
  const [arr, setArr] = useState([]);
  const [DefaultVal, setDefaultVal] = useState(null);

  useEffect(() => {
    axios.get("/subreddits").then((res) => setArr(res.data));
  }, []);

  console.log(fromHome);

  const CreateNewPost = async (e) => {
    await axios.post("/posts", {
      subreddit_id: fromHome ? value.value : value,
      user_id: user.user_id,
      post_title: titleInput,
      post_content: descriptionInput,
      post_image: urlInput,
      post_upvotes: 0,
      post_timestamp: moment().format("YYYY-MM-DDTHH:mm"),
    });

    setTitleInput("");
    setDescriptionInput("");
    setUrlInput("");

    let newUpdate = pageUpdates + 1;
    setPageUpdates(newUpdate);
  };

  const getTitle = () => {
    for (let i of arr) {
      if (i.subreddit_id == value) {
        return i.subreddit_title;
      }
    }
    //setFromHome(false);
  };

  let defaultVal = {
    value: value,
    label: getTitle(),
  };

  //console.log(defaultVal);
  if (defaultVal.label && !DefaultVal) {
    setDefaultVal(defaultVal);
  }

  console.log(DefaultVal);

  let options = [];
  for (let i of arr) {
    options.push({
      value: i.subreddit_id,
      label: i.subreddit_title,
    });
  }

  const cases = () => {
    if (!fromHome && DefaultVal) {
      return "1";
    } else if (fromHome) {
      return "2";
    }
  };

  return (
    <div className='form__container'>
      {(() => {
        switch (cases()) {
          case "1":
            return (
              <Select
                defaultValue={DefaultVal}
                onChange={setValue}
                options={options}
                placeholder={"subreddit"}
              />
            );
          case "2":
            return (
              <Select
                defaultValue={"select a subreddit"}
                onChange={setValue}
                options={options}
                placeholder={"select a subreddit"}
              />
            );
          default:
            return (
              <div>
                <h2>loading...</h2>
              </div>
            );
        }
      })()}
      <div className='newPost__title'>
        <textarea
          value={titleInput}
          placeholder='Post Title'
          onChange={(e) => setTitleInput(e.target.value)}
        />
      </div>
      <div className='newPost__description'>
        <textarea
          value={descriptionInput}
          placeholder='Content'
          onChange={(e) => setDescriptionInput(e.target.value)}
        />
      </div>
      <div className='newPost__url'>
        <textarea
          value={urlInput}
          placeholder='Image URL(optional)'
          onChange={(e) => setUrlInput(e.target.value)}
        />
      </div>
      <div className='newPost__button'>
        <button
          onClick={() => {
            if (value === "select a subreddit") {
              alert("Please choose a subreddit");
            } else {
              setCreatePostForm(false);
              CreateNewPost();
              setValue("select a subreddit");
            }
          }}
          type='submit'
        >
          Create
        </button>
        <button onClick={() => setCreatePostForm(false)} type='submit'>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default NewPost;

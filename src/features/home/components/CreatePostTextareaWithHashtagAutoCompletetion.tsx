import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";
import { fetchSuggestions } from "../services/HashtagPrefixSearch";
import Spinner from "@/components/Spinner";

type Props = {
  register: UseFormRegister<{
    content: string;
    visibility: "friends" | "public";
    poster?: unknown;
  }>;
  setValue: UseFormSetValue<{
    content: string;
    visibility: "friends" | "public";
    poster?: unknown;
  }>;
};

const CreatePostTextareaWithHashtagAutoCompletetion: React.FC<Props> = ({ register, setValue }) => {
  const contentTextInputRef = useRef<HTMLTextAreaElement | null>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0 });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTag, setSearchTag] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const { data: suggestions, isLoading } = useQuery({
    queryKey: [searchTag],
    queryFn: () => fetchSuggestions(searchTag),
    enabled: searchTag.length > 1 && !isTyping,
  });

  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setIsTyping(false);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTag]);

  const syncMirror = () => {
    if (!contentTextInputRef.current || !mirrorRef.current) return;

    const text = contentTextInputRef.current.value;
    const cursorPos = contentTextInputRef.current.selectionStart;

    const beforeCursor = text.slice(0, cursorPos);
    const afterCursor = text.slice(cursorPos);

    // insert marker span for cursor
    mirrorRef.current.innerHTML =
      beforeCursor.replace(/\n/g, "<br/>") +
      '<span id="caret-marker">|</span>' +
      afterCursor.replace(/\n/g, "<br/>");

    const caret = mirrorRef.current.querySelector("#caret-marker");
    if (caret) {
      const rect = caret.getBoundingClientRect();
      const containerRect = mirrorRef.current.getBoundingClientRect();

      setDropdownPos({
        top: rect.top - containerRect.top + 20, // adjust for line height
        left: rect.left - containerRect.left,
      });
    }
  };

  const insertHashtag = (tag: string) => {
    const textarea = contentTextInputRef.current;
    if (!textarea) return;

    const content = textarea.value;
    const cursorPos = textarea.selectionStart;

    const textBefore = content.slice(0, cursorPos).replace(/#\w*$/, `#${tag} `);
    const textAfter = content.slice(cursorPos); // handling cases where user comebase and insert a hashtag, this will be empty incase of cursor is at last character

    const newContent = textBefore + textAfter;

    setValue("content", newContent);
    setShowSuggestions(false);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = textBefore.length;
    }, 0);
  };

  const handleTextChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = e.target.value;
    const cursorPos = e.target.selectionStart;
    syncMirror();

    const textBeforeCursor = content.slice(0, cursorPos);

    const match = textBeforeCursor.match(/#(\w*)$/);

    if (match) {
      const currentTag = match[1];
      setSearchTag(currentTag);
      if (currentTag.length > 1) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
      setSearchTag("");
    }

    // Update form state
    setValue("content", content);
  };
  return (
    <div>
      <textarea
        id="post-content"
        {...register("content")}
        onChange={(e) => {
          register("content").onChange(e);
          handleTextChange(e);
        }}
        rows={4}
        placeholder="Whats in your mind?"
        className="bg-grey-light row-auto w-full resize-none auto-cols-min rounded-lg p-2 px-3 outline-1 focus:outline-2 focus:outline-zinc-400/50"
        ref={(el) => {
          register("content").ref(el);
          contentTextInputRef.current = el;
          // Attach ref for cursor position if
        }}
      />

      {/* Hidden Mirror Div */}
      <div
        ref={mirrorRef}
        className="pointer-events-none invisible absolute top-0 left-0 w-full p-2 px-3 break-words whitespace-pre-wrap"
        aria-hidden="true"
      />

      {/* Suggestion Dropdown */}
      {showSuggestions && (
        <div
          className="bg-grey absolute z-10 min-w-10 rounded-md shadow-md"
          style={{ top: dropdownPos.top, left: dropdownPos.left }}
        >
          {isLoading && <Spinner />}
          {suggestions &&
            suggestions.length > 0 &&
            suggestions.map((tag) => (
              <div
                key={tag.name}
                className="flex cursor-pointer justify-between gap-2 rounded-md px-3 py-1 hover:bg-gray-400/50"
                onClick={() => insertHashtag(tag.name)}
              >
                <span>#{tag.name}</span>
                <span className="text-zinc-400">{tag.count} posts</span>
              </div>
            ))}

          {suggestions && suggestions.length === 0 && (
            <p
              className="cursor-pointer rounded-md p-2 text-sm hover:bg-gray-400/50"
              onClick={() => insertHashtag(searchTag)}
            >
              Add hashtag
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CreatePostTextareaWithHashtagAutoCompletetion;

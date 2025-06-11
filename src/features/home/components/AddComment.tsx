const AddComment = () => {
  return (
    <div className="group w-full">
      <form className="flex items-center justify-between gap-3">
        <input
          type="text"
          placeholder="Add a comment "
          className="w-full rounded-xl border-none px-4 py-1 transition-colors duration-200 ease-out outline-none focus:bg-zinc-400/20"
        />
        {/* <ButtonPop className="h-fit ">Comment</ButtonPop> */}
        <button className="text-pop-green h-fit cursor-pointer opacity-0 group-hover:opacity-100">
          Comment
        </button>
      </form>
    </div>
  );
};

export default AddComment;

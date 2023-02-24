export const Container = (props) => {
  return (
    <div className="flex justify-center items-center p-10 w-screen h-screen">
      <div className="h-full w-full flex flex-col items-center px-10 py-5 bg-[#FDFDFD] rounded-md">
        {props.children}
      </div>
    </div>
  );
};

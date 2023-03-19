export default function Tutorial() {
  return (
    <div className="flex flex-col items-center">
      {" "}
      <br></br>
      <h1 className=" mx-auto text-4xl sm:text-5xl text-center sm:text-left max-w-xl    p-6 sm:p-10">
        Welcome to a truly intelligent group generator.
      </h1>
      <br></br>
      <section className="max-w-xl mx-auto px-3">
        <p className="mx-3 text-lg sm:text-xl text-gray-500 my-2">
          {" "}
          This web application divides a number of members into groups, so that
          each group have a balanced distribution regarding on{" "}
          <u>multiple attributes simultaneously</u>.{" "}
        </p>
        <p className="mx-3 text-lg sm:text-xl text-gray-500 my-2">
          What makes our tool different from others is that there is few online
          tool which can take multiple attributes into considerations. For
          example, a teacher wants to make students' groups where each group has
          almost equal sex ratio while average scores are well distributed
          across groups. Finding an optimal balance might be challenging even
          for a human.
        </p>
        <p className="mx-3 text-lg sm:text-xl text-gray-500 my-2">
          This online tool finds a balanced grouping with respect to multiple
          attributes by running an optimization, where its objective is to make
          the distribution of each group as similar as possible with the whole
          members' distribution.
        </p>
      </section>
      <div className="fixed bottom-0 w-full flex flex-col items-center bg-white  shadow-sky-300">
        {" "}
        <hr className="w-full sm:max-w-xl "></hr>
        <div className="flex flex-col items-center py-2 sm:py-5">
          <button
            className="flex items-center"
            onClick={() => {
              window.location.href = `mailto:junbs95@gmail.com?subject=${encodeURIComponent(
                "Hello. I am an user of diverse group"
              )}`;
            }}
          >
            <span className="mr-2 text-gray-500">Contact me: </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="skyblue"
              className="w-8 h-8"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

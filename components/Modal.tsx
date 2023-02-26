import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState, useEffect } from "react";

interface Props {
  children: React.ReactNode;
  title: string;
  isOpen: boolean;
  setIsOpen: () => void;
}

const Modal: React.FC<Props> = ({ children, title, isOpen, setIsOpen }) => {
  const cancelButtonRef = useRef(null);
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 "
        initialFocus={cancelButtonRef}
        onClose={setIsOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-200 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div
          className="fixed relative inset-0 z-10 overflow-y-auto"
          style={{ transform: "translateY(-20%)" }}
        >
          <div className="min-h-fullitems-end flex justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95"
            >
              {/* This is where we adjust width of popup */}
              <Dialog.Panel className=" relative transform overflow-hidden rounded-lg bg-white text-left shadow-md transition-all sm:my-3 sm:max-w-xl">
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="" id="containing div">
                    <div className="mt-3 text-center sm:mx-0  sm:mt-0 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        {title}
                      </Dialog.Title>
                      <div className="mt-6 flex flex-col px-1">{children}</div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;

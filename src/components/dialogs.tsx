import { createRef, useState } from "react"

export default function Dialogs({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (isOpen: boolean) => void}) {  
  const inputRef = createRef<HTMLInputElement>()

  async function createGuild() {
    if (inputRef.current?.value && inputRef.current?.value.length > 0) {
      const response = await fetch("/api/guilds", {
        method: 'POST',
        body: JSON.stringify({
          name: inputRef.current?.value,
          ownerId: 1
        }),
        headers: { "Content-Type": "application/json" }
      })
      setIsOpen(false)
      console.log(response)
    }
  }

  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className={`fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity ${isOpen ? "" : "hidden"}`} aria-hidden="true"></div>
      <div className={`fixed inset-0 z-10 w-screen overflow-y-auto ${isOpen ? "" : "hidden"}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-base font-semibold leading-6 text-gray-900" id="modal-title">Create a new guild</h3>
                  <input type="text" name="guildname" placeholder="Guild name" className="mt-2 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 outline-none shadow-lg" ref={inputRef}/>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button type="button" className="inline-flex w-full justify-center rounded-md bg-green-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto" onClick={() => createGuild()}>Create</button>
              <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" onClick={() => setIsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
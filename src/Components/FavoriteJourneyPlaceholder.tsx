const FavoriteJourneyPlaceholder = () => {
  return (
    <div className="flex flex-col gap-2 items-center text-gray-500 border-2 border-gray-400 border-dashed rounded-md py-3 px-5">
      <p className="text-xs font-bold">MON TRAJET PRÉFÉRÉ</p>
      <div className="flex flex-col items-center justify-center gap-2 w-full">
        <p className="text-xs text-center font-bold">Voyez d‘un coup d‘œil la faisabilité de votre trajet préféré.</p>
        <p className="text-xs text-center">
          Sélectionnez les stations de départ et d’arrivée dans les{" "}
          <a className="font-bold underline" href="" onClick={() => chrome.runtime.openOptionsPage()}>
            options ↗︎
          </a>
          .
        </p>
      </div>
    </div>
  )
}

export default FavoriteJourneyPlaceholder

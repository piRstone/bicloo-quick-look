const Home = () => {
  return (
    <div>
      <p className="text-base font-thin mb-2">Ajoutez vos stations pour commencer ↗</p>
      <p className="text-sm text-gray-400">Bicloo Quick Look {process.env.PLASMO_PUBLIC_VERSION}</p>
    </div>
  )
}

export default Home

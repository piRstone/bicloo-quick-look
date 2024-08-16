type OptionsButtonProps = {
  text: string
  onClick: () => void
}

const OptionsButton = ({ text, onClick }: OptionsButtonProps) => {
  return (
    <button className="bg-green-500 text-base text-white font-bold hover:bg-green-600 rounded-3xl px-3 py-1" onClick={onClick}>
      {text}
    </button>
  )
}

export default OptionsButton

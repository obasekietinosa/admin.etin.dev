export default function ImageComponent({
  src,
  altText,
}: {
  src: string
  altText: string
}) {
  return (
    <img
      src={src}
      alt={altText}
      className="max-w-full h-auto rounded-lg my-4"
    />
  )
}

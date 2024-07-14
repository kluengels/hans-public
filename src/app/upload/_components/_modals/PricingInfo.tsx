export default function PricingInfo({duration}:  {duration: number}) {

  const pricePerSecond = (Number(process.env.NEXT_PUBLIC_OPENAI_PRICE) || 0.006) /60;
  let roundedPrice = (duration * pricePerSecond).toFixed(2);
  if (roundedPrice === "0.00") roundedPrice = "0.01";
  console.log("pricePerSecond", pricePerSecond);

  return (
    <>
         <div className="my-2">
        Hans will use your account at OpenAI to turn your audio recording into
        text. The estimated costs are{" "}
        <span className="font-bold">{roundedPrice} US-Dollar</span>.
      </div>
    
    </>
  )
}
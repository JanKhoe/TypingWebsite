import { NextResponse } from "next/server";
import { prisma } from "../primaClient";

export async function GET() {
  const rows : number = await prisma.paragraphs.count();
  const randomIndex = Math.floor(Math.random() * rows);
  console.log("~ JANSEN INPUT ~");
  console.log(rows);
  console.log(randomIndex);
  const RandomParagraph = await prisma.paragraphs.findMany(
    {
      skip: randomIndex,
      take: 1
    }
  )
  console.log(await prisma.paragraphs.findMany());

  return NextResponse.json(RandomParagraph[0])
}
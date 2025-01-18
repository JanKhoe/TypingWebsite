import { NextResponse } from "next/server";
import { prisma } from "../primaClient";

export async function GET() {
  const rows : number = await prisma.paragraphs.count();
  const randomIndex = Math.floor(Math.random() * rows);
  const RandomParagraph = await prisma.paragraphs.findMany(
    {
      skip: randomIndex,
      take: 1
    }
  )

  return NextResponse.json(RandomParagraph[0])
}
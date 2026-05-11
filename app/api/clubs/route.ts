import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { ClubInput } from "@/types/club";

export async function GET() {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("distance", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body: ClubInput = await req.json();
  const { data, error } = await supabase
    .from("clubs")
    .insert([body])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const { error } = await supabase.from("clubs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

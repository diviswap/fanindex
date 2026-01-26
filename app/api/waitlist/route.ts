import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = await createClient()

    // Insert email into waitlist
    const { data, error } = await supabase
      .from("waitlist")
      .insert({ email: email.toLowerCase().trim() })
      .select()
      .single()

    if (error) {
      // Check if it's a duplicate email error
      if (error.code === "23505") {
        return NextResponse.json({ error: "This email is already on the waitlist" }, { status: 409 })
      }

      console.error("[v0] Waitlist insert error:", error)
      return NextResponse.json({ error: "Failed to join waitlist" }, { status: 500 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully joined the waitlist!",
        data,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Waitlist API error:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}

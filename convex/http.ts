import { httpRouter } from "convex/server";
import { api, internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const http = httpRouter();

http.route({
  path: "/getUserByEmail",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const email = new URL(request.url).searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const user = await ctx.runQuery(internal.users.getUser, {
      email,
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
});

http.route({
  path: "/getUserByUsername",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const username = new URL(request.url).searchParams.get("username");

    if (!username) {
      return new Response(
        JSON.stringify({ error: "Username parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    const user = await ctx.runQuery(internal.users.getUserByUsername, {
      username,
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }),
});

http.route({
  path: "/createUser",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    // Parse the request body
    const body = await request.json();
    console.log("boody", body);

    // Validate required fields
    if (!body.email) {
      return new Response(
        JSON.stringify({
          error: "Email and password are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }

    try {
      // Check if user already exists
      const existingUser = await ctx.runQuery(internal.users.getUser, {
        email: body.email,
      });

      if (existingUser) {
        return new Response(
          JSON.stringify({
            error: "User already exists",
          }),
          {
            status: 409,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
      }

      // Create new user
      const newUser = await ctx.runMutation(internal.users.createUser, {
        fullname: body.firstname,
        username: body.firstname.split(" ")[0].toLowerCase(),
        email: body.email,
        password: body.password,
        role: body.role,
        image: body.image,
      });

      return new Response(
        JSON.stringify({
          message: "User created successfully",
          user: newUser,
        }),
        {
          status: 201,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error: any) {
      return new Response(
        JSON.stringify({
          error: "Failed to create user",
          details: error.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  }),
});

http.route({
  path: "/updateUserToken",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const { userId, resetToken, resetTokenExpiry, hashPassword } =
      await request.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: "userId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ctx.runMutation(internal.users.updateUserToken, {
      userId,
      resetToken,
      resetTokenExpiry,
      hashPassword,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;
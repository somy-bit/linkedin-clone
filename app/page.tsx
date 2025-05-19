import PostFeeds from "@/components/PostFeeds";
import PostForm from "@/components/PostForm";
import UserInformation from "@/components/UserInformation";
import { connectDB } from "@/mangodb/db";
import { Post } from "@/mangodb/models/post";
import { SignedIn } from "@clerk/nextjs";

export const revalidate = 0;

export default async function Home() {

  await connectDB()

  const posts = await Post.getAllPosts();

  return (
    <div className="grid grid-cols-8 mt-5 sm:px-5" >
      <section className="hidden md:inline md:col-span-2">
        <UserInformation posts={posts}/>
      </section>

      <section className="col-span-full md:col-span-6 xl:col-span-4 xl:max-w-xl mx-auto w-full">

        <SignedIn>
          <PostForm />
        </SignedIn>

        <PostFeeds
          posts={posts}
        />
      </section>

      <section className="hidden xl:inline xl:col-span-2 justify-center">
        {/* widget */}
      </section>
    </div>
  );
}

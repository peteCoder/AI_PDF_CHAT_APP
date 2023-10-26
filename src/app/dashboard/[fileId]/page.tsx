import ChatWrapper from "@/components/chat/ChatWrapper";
import PDFRenderer from "@/components/PDFRenderer";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";

const FilePage = async ({ params }: { params: { fileId: string } }) => {
  const { fileId } = params;

  const { getUser } = getKindeServerSession();

  const user = getUser();

  if (!user || !user?.id) {
    return redirect(`/auth-callback?origin=dashboard/${fileId}`);
  }

  // Make db call
  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  });

  if (!file) {
    notFound();
  } else {
    return (
      <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
          {/* Left side */}
          <div className="flex-1 xl:flex">
            <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
              <PDFRenderer url={file.url} />
            </div>
          </div>

          {/* Right side */}
          <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
            {/* Implement optimistic updates and infinite queries with chatbot */}
            <ChatWrapper fileId={file.id} />
          </div>
        </div>
      </div>
    );
  }
};

export default FilePage;

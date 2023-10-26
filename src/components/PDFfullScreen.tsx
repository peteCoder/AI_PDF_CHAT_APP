import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Expand, Loader2 } from "lucide-react";
import SimpleBar from "simplebar-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";

const PDFfullScreen = ({ url }: { url: string }) => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const [numPages, setNumPages] = useState<number>(0);
  
  const { width, ref } = useResizeDetector();
  // Increase and decrease page actions

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(v) => {
        if (!v) {
          setIsOpen(v);
        }
      }}
    >
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        <Button className="gap-1.5" variant={"ghost"} aria-label="fullscreen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full">
        <SimpleBar
          className="max-h-[calc(100vh-10rem)] mt-6"
          forceVisible="y"
          autoHide={false}
        >
          <div ref={ref} className="">
            <Document
              loading={
                <div className="h-full w-full flex justify-center items-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              file={url}
              className="max-h-full"
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  width={width ? width : 1}
                  pageNumber={i + 1}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6  animate-spin" />
                    </div>
                  }
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PDFfullScreen;

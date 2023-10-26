"use client";

// 05:25:00
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import {
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useToast } from "@/components/ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
 
// React hook form
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import Simplebar from "simplebar-react";
import PDFfullScreen from "./PDFfullScreen";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PDFRenderer = ({ url }: { url: string }) => {
  const { toast } = useToast();

  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [currentPageNumber, setCurrentPageNumber] = useState<number>(1);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  // Form logic
  const customPageValidator = z.object({
    page: z
      .string()
      .refine((num) => Number(num) > 0 && Number(num) <= numPages),
  });

  type TCustomePageValidator = z.infer<typeof customPageValidator>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<TCustomePageValidator>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customPageValidator),
  });

  const handlePageSubmit = ({ page }: TCustomePageValidator) => {
    setCurrentPageNumber(Number(page));
    setValue("page", String(page));
  };

  // react resize dectector hook
  const { width, ref } = useResizeDetector();

  // Increase and decrease page actions
  const increasePageNumber = () => {
    setCurrentPageNumber((prev) => {
      if (prev + 1 > numPages) {
        return numPages;
      }
      setValue("page", String(currentPageNumber + 1));
      return prev + 1;
    });
  };
  const decreasePageNumber = () => {
    setCurrentPageNumber((prev) => {
      if (prev - 1 < 1) {
        return 1;
      }
      setValue("page", String(currentPageNumber - 1));

      return prev - 1;
    });
  };

  return (
    <div className="w-full bg-white rounded-md shadow flex flex-col items-center p-1">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currentPageNumber <= 1}
            onClick={decreasePageNumber}
            variant={"ghost"}
            aria-label="previous page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-15">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit)();
                }
              }}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1 flex items-center">
              <span>/</span>
              <span>
                {numPages === 0 ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  numPages
                )}
              </span>
            </p>
          </div>
          <Button
            disabled={currentPageNumber >= numPages || numPages === 0}
            onClick={increasePageNumber}
            variant={"ghost"}
            aria-label="next page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-x-2">
          {/* Zoom */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-1.5" aria-label="zoom" variant={"ghost"}>
                <Search className="h-4 w-4" />
                {scale * 100}% <ChevronsDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setScale(0.9)}>
                90%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(0.95)}>
                95%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1)}>
                100%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(1.5)}>
                150%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2)}>
                200%
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setScale(2.5)}>
                250%
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            aria-label="rotate 90 degrees"
            variant={"ghost"}
          >
            <RotateCw className="h-4 w-4" />
          </Button>

          <PDFfullScreen url={url} />
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <Simplebar
          className="max-h-[calc(100vh-10rem)]"
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
              {isLoading && renderedScale ? (
                <Page
                  scale={scale}
                  width={width ? width : 1}
                  pageNumber={currentPageNumber}
                  rotate={rotation}
                  key={"@" + renderedScale}
                />
              ) : null}

              <Page
                className={cn(isLoading ? "hidden" : "")}
                scale={scale}
                width={width ? width : 1}
                pageNumber={currentPageNumber}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className="flex justify-center">
                    <Loader2 className="my-24 h-6 w-6  animate-spin" />
                  </div>
                }
                onRenderSuccess={() => setRenderedScale(scale)}
              />
            </Document>
          </div>
        </Simplebar>
      </div>
    </div>
  );
};

export default PDFRenderer;

import { createCliRenderer } from "@opentui/core";
import { createRoot, useKeyboard } from "@opentui/react";
import { useState } from "react";
import { basename, dirname } from "path";
import { getPageCount, splitPDF, mergePDFs } from "@pdf-tools/utils";
import { UnifiedBrowser } from "./components/UnifiedBrowser";
import { PagePicker } from "./components/PagePicker";
import { Processing } from "./components/Processing";
import { Result } from "./components/Result";
import { getSplitOutputPath, getMergeOutputPath } from "./utils/paths";

type Screen =
  | "main_menu"
  | "split_file_select"
  | "split_page_select"
  | "split_processing"
  | "split_result"
  | "merge_file_select"
  | "merge_processing"
  | "merge_result";

type MenuOption = "split" | "merge" | "exit";

interface SelectOption {
  name: string;
  description: string;
  value: MenuOption;
}

const menuOptions: SelectOption[] = [
  {
    name: "Split PDF",
    description: "Extract specific pages from a PDF",
    value: "split",
  },
  {
    name: "Merge PDFs",
    description: "Combine multiple PDFs into one",
    value: "merge",
  },
  { name: "Exit", description: "Quit the application", value: "exit" },
];

function App() {
  // Screen state
  const [screen, setScreen] = useState<Screen>("main_menu");

  // Current directory for file browsing
  const [currentDirectory, setCurrentDirectory] = useState(process.cwd());

  // Split flow state
  const [splitFile, setSplitFile] = useState<string | null>(null);
  const [splitPageCount, setSplitPageCount] = useState(0);
  const [splitSelectedPages, setSplitSelectedPages] = useState<Set<number>>(
    new Set(),
  );

  // Merge flow state
  const [mergeSelectedFiles, setMergeSelectedFiles] = useState<string[]>([]);

  // Result state
  const [resultMessage, setResultMessage] = useState("");
  const [resultIsError, setResultIsError] = useState(false);

  // Global keyboard handler for quit (only on main menu)
  useKeyboard((key) => {
    if (screen === "main_menu" && (key.name === "q" || key.name === "escape")) {
      process.exit(0);
    }
  });

  // Menu selection handler
  const handleMenuSelect = (value: string) => {
    const option = value as MenuOption;

    if (option === "exit") {
      process.exit(0);
    } else if (option === "split") {
      setScreen("split_file_select");
    } else if (option === "merge") {
      setScreen("merge_file_select");
    }
  };

  // Split flow handlers
  const handleSplitFileSelect = async (filePath: string) => {
    setSplitFile(filePath);
    setSplitSelectedPages(new Set());

    try {
      const count = await getPageCount(filePath);
      setSplitPageCount(count);
      setScreen("split_page_select");
    } catch (error) {
      setResultMessage(
        `Failed to load PDF: ${error instanceof Error ? error.message : String(error)}`,
      );
      setResultIsError(true);
      setScreen("split_result");
    }
  };

  const handlePageToggle = (page: number) => {
    setSplitSelectedPages((prev) => {
      const next = new Set(prev);
      if (next.has(page)) {
        next.delete(page);
      } else {
        next.add(page);
      }
      return next;
    });
  };

  const handleSplitConfirm = async () => {
    setScreen("split_processing");

    try {
      const fileName = basename(splitFile!);
      const fileDir = dirname(splitFile!);
      const outputPath = getSplitOutputPath(fileName, fileDir);
      const pages = Array.from(splitSelectedPages).sort((a, b) => a - b);

      await splitPDF(splitFile!, outputPath, pages);

      setResultMessage(
        `Successfully extracted ${pages.length} page(s) to ${fileName.replace(".pdf", "_split.pdf")}`,
      );
      setResultIsError(false);
    } catch (error) {
      setResultMessage(
        `Split failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      setResultIsError(true);
    }

    setScreen("split_result");
  };

  // Merge flow handlers
  const handleMergeConfirm = async (filePaths: string[]) => {
    setMergeSelectedFiles(filePaths);
    setScreen("merge_processing");

    try {
      // Output to the directory of the first file
      const outputDir = dirname(filePaths[0]!);
      const outputPath = getMergeOutputPath(outputDir);

      await mergePDFs(filePaths, outputPath);

      setResultMessage(
        `Successfully merged ${filePaths.length} files into merged.pdf`,
      );
      setResultIsError(false);
    } catch (error) {
      setResultMessage(
        `Merge failed: ${error instanceof Error ? error.message : String(error)}`,
      );
      setResultIsError(true);
    }

    setScreen("merge_result");
  };

  // Reset and return to menu
  const handleReturnToMenu = () => {
    setSplitFile(null);
    setSplitPageCount(0);
    setSplitSelectedPages(new Set());
    setMergeSelectedFiles([]);
    setResultMessage("");
    setResultIsError(false);
    setCurrentDirectory(process.cwd()); // Reset to original directory
    setScreen("main_menu");
  };

  // Render current screen
  if (screen === "main_menu") {
    return (
      <box flexDirection="column" padding={1}>
        <text>
          <strong>PDF Tools</strong>
        </text>
        <text>
          <span fg="gray">
            Navigate with arrows, press Enter to select (q to quit)
          </span>
        </text>
        <box
          style={{
            height: 8,
            marginTop: 1,
            border: true,
          }}
        >
          <select
            style={{ flexGrow: 1 }}
            options={menuOptions}
            onSelect={(_, option) => handleMenuSelect(option?.value)}
            focused
          />
        </box>
      </box>
    );
  }

  if (screen === "split_file_select") {
    return (
      <UnifiedBrowser
        mode="single"
        title="Select a PDF to split"
        currentDirectory={currentDirectory}
        onDirectoryChange={setCurrentDirectory}
        onFileSelect={handleSplitFileSelect}
        onBack={handleReturnToMenu}
      />
    );
  }

  if (screen === "split_page_select") {
    return (
      <PagePicker
        fileName={basename(splitFile!)}
        pageCount={splitPageCount}
        selectedPages={splitSelectedPages}
        onToggle={handlePageToggle}
        onConfirm={handleSplitConfirm}
        onBack={() => setScreen("split_file_select")}
      />
    );
  }

  if (screen === "split_processing") {
    return <Processing message="Splitting PDF..." />;
  }

  if (screen === "split_result") {
    return (
      <Result
        message={resultMessage}
        isError={resultIsError}
        onDismiss={handleReturnToMenu}
      />
    );
  }

  if (screen === "merge_file_select") {
    return (
      <UnifiedBrowser
        mode="multi"
        title="Select PDFs to merge (minimum 2)"
        currentDirectory={currentDirectory}
        onDirectoryChange={setCurrentDirectory}
        onFileSelect={() => {}}
        onFilesConfirm={handleMergeConfirm}
        onBack={handleReturnToMenu}
      />
    );
  }

  if (screen === "merge_processing") {
    return <Processing message="Merging PDFs..." />;
  }

  if (screen === "merge_result") {
    return (
      <Result
        message={resultMessage}
        isError={resultIsError}
        onDismiss={handleReturnToMenu}
      />
    );
  }

  return null;
}

const renderer = await createCliRenderer();
createRoot(renderer).render(<App />);

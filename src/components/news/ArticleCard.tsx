import { ExternalLink } from "lucide-react";
import type { Article } from "@/hooks/useNews";
import { formatRelativeTime } from "@/lib/format";
import { Card } from "@/components/ui/Card";

export function ArticleCard({ article }: { article: Article }) {
  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
      <Card className="p-4 hover:bg-surface-2 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-fg-muted mb-1.5">
              <span className="font-medium text-cat-news truncate max-w-[60%]">{article.source}</span>
              {article.publishedAt && (
                <>
                  <span>·</span>
                  <span>{formatRelativeTime(new Date(article.publishedAt))}</span>
                </>
              )}
            </div>
            <h4 className="font-semibold leading-snug">{article.title}</h4>
            {article.summary && (
              <p className="text-sm text-fg-muted mt-1.5 line-clamp-2">{article.summary}</p>
            )}
          </div>
          <ExternalLink size={15} className="text-fg-subtle shrink-0 mt-1" />
        </div>
      </Card>
    </a>
  );
}

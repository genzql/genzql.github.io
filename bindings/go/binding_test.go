package tree_sitter_base_sql_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_base_sql "github.com/tree-sitter/tree-sitter-base_sql/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_base_sql.Language())
	if language == nil {
		t.Errorf("Error loading BaseSql grammar")
	}
}

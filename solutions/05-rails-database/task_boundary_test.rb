test "a 100 character title is valid" do
  task = Task.new(title: "a" * 100)

  assert task.valid?
end

# 既存の101文字testと組み合わせることで、
# 「100までは成功、101から失敗」という境界を固定します。

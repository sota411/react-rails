Task.find_or_create_by!(title: "Reactの画面を開く") do |task|
  task.done = true
end

Task.find_or_create_by!(title: "NetworkでGETを見つける")
Task.find_or_create_by!(title: "Railsログとstatusを照合する")

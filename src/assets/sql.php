<?php

$conn = mysqli_connect("localhost", "root", "123","police");
if (!$conn) {
	echo "数据库连接失败" . mysqli_connect_error();
}
mysqli_query($conn,"SET NAMES utf8");

$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
	$request = json_decode($postdata);
	$func = $request->func;
	$data = $request->data;
	call_user_func($func, $conn,$data);
}

function selectRecords($conn,$data){
	$isShouxu = $data->isShouxu;
	$tableName = $data->tableName;
	$leftjoin = $isShouxu ? " from $tableName left join law_case " : " from law_case left join $tableName ";
	$sql = "select caseName,caseNumber,caseContent,law_case.id lawCaseID,$tableName.* $leftjoin on $tableName.caseID = law_case.id order by createDate desc";
	getSelectResult($conn,$sql);
}

function selectLastDocNumber($conn,$tableName){
	$sql = "select * from $tableName order by id desc limit 1";
	getSelectResult($conn,$sql);
}

function selectLastDocNumber2($conn,$tableName){
	$sql = "select * from $tableName order by docNumber2 desc limit 1";
	getSelectResult($conn,$sql);
}

function getSelectResult($conn,$sql)
{
	$result = mysqli_query($conn,$sql);
	$arrResult = array();
	while ($temp = mysqli_fetch_assoc($result)) {
		array_push($arrResult, $temp);
	}
	echo json_encode($arrResult);
}

function insert($conn,$data)
{
	$tableName = $data->tableName;
	$tableData = $data->tableData;
	$sql = "insert into $tableName (";

	foreach ($tableData as $key => $value) {
		$sql .= $key . ",";
	}
	$sql = substr($sql, 0, strlen($sql) - 1) . ") values (";
	foreach ($tableData as $key => $value) {
		if ($value == 'now()') {
			$sql .= $value . ",";
		} else {
			$sql .= "'" . $value . "',";
		}
	}

	$sql = substr($sql, 0, strlen($sql) - 1) . ")";
	mysqli_query($conn,$sql);
	$id = mysqli_insert_id($conn);
	echo $id;
}

function update($conn,$data)
{
	$tableName = $data->tableName;
	$tableData = $data->tableData;
	$id = $data->id;
	$sql = "update $tableName set ";
	foreach ($tableData as $key => $value) {
		$sql .= "$key='$value',";
	}
	$sql = substr($sql, 0, strlen($sql) - 1) . " where id = $id";

	$result = mysqli_query($conn,$sql);
	echo $result;
}

function del($conn,$data){
	$tableName = $data->tableName;
	$id = $data->id;
	$sql = "delete from $tableName where id = $id";
	$result = mysqli_query($conn,$sql);
	echo $result;
}


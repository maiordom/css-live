<?php

$index = 0;
$is_exist = array_key_exists( 'fileContent' . $index, $_REQUEST );

while ( $is_exist === true ) {
    $fileContent = $_REQUEST[ 'fileContent' . $index ];
    $matches = Array();
    preg_match( '/data:image\/(jpeg|png|jpg|gif);base64,/', $fileContent, $matches );
    $type = $matches[ 1 ];
    $fileContent = str_replace( 'data:image/' . $type . ';base64,', '', $_REQUEST[ 'fileContent' . $index ] );
    $dataURL = base64_decode( $fileContent );
    file_put_contents( 'cache/' . md5( $dataURL ) . '.' . $type, $dataURL );
    $is_exist = array_key_exists( 'fileContent' . ++$index, $_REQUEST );
}
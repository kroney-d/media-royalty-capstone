#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.json 
}

function yaml_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${P1PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ccp-template.yaml | sed -e $'s/\\\\n/\\\n        /g'
}

ORG=1
P0PORT=7051
P1PORT=8051
CAPORT=7054
#PEERPEM=crypto-config/peerOrganizations/artist.mediacoin.com/tlsca/tlsca.artist.mediacoin.com-cert.pem
#CAPEM=crypto-config/peerOrganizations/artist.mediacoin.com/ca/ca.artist.mediacoin.com-cert.pem
PEERPEM=crypto-config/peerOrganizations/artist.mediacoin.com/tlsca/tlsca.artist.mediacoin.com-cert.pem
CAPEM=crypto-config/peerOrganizations/artist.mediacoin.com/ca/ca.artist.mediacoin.com-cert.pem


echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-artist.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-artist.yaml

ORG=2
P0PORT=9051
P1PORT=10051
CAPORT=8054
#PEERPEM=crypto-config/peerOrganizations/buyer.mediacoin.com/tlsca/tlsca.buyer.mediacoin.com-cert.pem
#CAPEM=crypto-config/peerOrganizations/buyer.mediacoin.com/ca/ca.buyer.mediacoin.com-cert.pem
PEERPEM=crypto-config/peerOrganizations/buyer.mediacoin.com/tlsca/tlsca.buyer.mediacoin.com-cert.pem
CAPEM=crypto-config/peerOrganizations/buyer.mediacoin.com/ca/ca.buyer.mediacoin.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-buyer.json
echo "$(yaml_ccp $ORG $P0PORT $P1PORT $CAPORT $PEERPEM $CAPEM)" > connection-buyer.yaml

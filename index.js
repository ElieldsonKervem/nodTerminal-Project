//modulor externos
import inquirer from 'inquirer';

import fs from 'fs';

import chalk from 'chalk';

// modulos internos


operations();

function operations (){
    inquirer.prompt([
        {
            type: 'list',
            name: 'operation',
            message: 'Escolha uma operação',
            choices: [ // Correção: era 'choises', deve ser 'choices'
                'Criar conta',
                'Depositar',
                'Sacar',
                'Transferir',
                'Exibir extrato',
                'Sair' 
            ]
        }
    ]).then((answers) => {
        if(answers.operation === 'Criar conta'){
            createAccount();
        } 
        else if(answers.operation === 'Depositar'){
            deposit();
        }
        else if(answers.operation === 'Sacar'){
            withDraw();
        }
        else if(answers.operation === 'Transferir'){
            transfer();
        }
        else if(answers.operation === 'Exibir extrato'){
            showStatement()
        }
        else if(answers.operation === 'Sair'){
            exit()
        }
    }).catch((err) => {
        console.log(err);
    });
}    


function createAccount(){
    console.log(chalk.blue('Criação de conta'));
    console.log(chalk.blue('Defina as opções da sua conta abaixo'));
    buildCount();
}


function buildCount (){
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Digite o nome do titular da conta'
        }
    ]).then((answers) => {
        
            if(!fs.existsSync('accounts')){
                fs.mkdirSync('./accounts');

            }
            //cria a pasta da conta caso pasta conta ja exista não cria outra
            if((fs.existsSync(`accounts/${answers.name}.json`))){
                console.log(chalk.red('Essa nome de conta  já existe,escolha outra'));
               return buildCount();
            }
            //verfica se a pasta existe e verica se o nome da conta ja existe
            fs.writeFileSync(`accounts/${answers.name}.json`,'{"balance": 0}',
            function(err){
                console.log(err);
            });
            //cria o arquivo da conta com o saldo zerado

            chalk.green('Conta criada com sucesso!');
            operations();
    }).catch((err) => {
        console.log(err);
    }
    );

    
}
//funcao criar conta


function deposit(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Digite o nome do titular da conta'
        }
    ]).then((answers)=>{
        if(!fs.existsSync(`accounts/${answers.name}.json`)){
            console.log(chalk.red('Essa conta não existe'));
            return operations();
        }
        else{
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'value',
                    message: 'Digite o valor do depósito'
                }
            ]).then((answers2) => {
                if(answers2.value < 1){
                    console.log(chalk.red('O valor do depósito deve ser maior que zero'));
                    return deposit();
                }
                const account = JSON.parse(fs.readFileSync(`accounts/${answers.name}.json`));
                console.log(typeof account);
                account.balance += parseInt(answers2.value);
                fs.writeFileSync(`accounts/${answers.name}.json`, JSON.stringify(account));
                console.log(chalk.green('Depósito efetuado com sucesso!'));
                operations();
            }).catch((err) => {
                console.log(err);

                
            })
        

        }
    
    })
}
//funcao deposito

//funcao sacar

function withDraw(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Digite o nome do titular da conta'
        }
    ]).then((answers)=>{
         if(!fs.existsSync(`accounts/${answers.name}.json`)){
            console.log(chalk.red('Essa conta não existe'));
            return operations();
        }
        else if(fs.existsSync(`accounts/${answers.name}.json`)){
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'value',
                    message: 'Digite o valor do saque'
                }
            ]).then((answers2) => {
                if(answers2.value < 1){
                    console.log(chalk.red('O valor do saque deve ser maior que zero'));
                    return withDraw();
                }
                const account = JSON.parse(fs.readFileSync(`accounts/${answers.name}.json`));
                console.log(typeof account);
                account.balance -= parseInt(answers2.value);
                fs.writeFileSync(`accounts/${answers.name}.json`, JSON.stringify(account));
                console.log(chalk.green('Saque efetuado com sucesso!'));
                operations();
            }).catch((err) => {
                console.log(err);

                
            })
        }
    })
}
//funcao transferir

function showStatement(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Digite o nome do titular da conta'
        }
    ]).then((answers)=>{
        if(!fs.existsSync(`accounts/${answers.name}.json`)){
            console.log(chalk.red('Essa conta não existe'));
            return operations();
        }
        else{
            const account = JSON.parse(fs.readFileSync(`accounts/${answers.name}.json`));
            console.log(chalk.green(`O saldo da conta é: ${account.balance}`));
            operations();
        }
    })
}
//funcao extrato

function exit(){
    console.log(chalk.red('Saindo...'));
    process.exit();
}
//funcao sair